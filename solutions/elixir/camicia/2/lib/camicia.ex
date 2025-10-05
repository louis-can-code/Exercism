defmodule Camicia do

  @enforce_keys [:player_a, :player_b]
  defstruct [:player_a, :player_b, pile: [], turn: :a, penalty: 0, paying: false]

  @doc """
    Simulate a card game between two players.
    Each player has a deck of cards represented as a list of strings.
    Returns a tuple with the result of the game:
    - `{:finished, cards, tricks}` if the game finishes with a winner
    - `{:loop, cards, tricks}` if the game enters a loop
    `cards` is the number of cards played.
    `tricks` is the number of central piles collected.

    ## Examples

      iex> Camicia.simulate(["2"], ["3"])
      {:finished, 2, 1}

      iex> Camicia.simulate(["J", "2", "3"], ["4", "J", "5"])
      {:loop, 8, 3}
  """

  @spec simulate(list(String.t()), list(String.t())) ::
          {:finished | :loop, non_neg_integer(), non_neg_integer()}
  def simulate(player_a, player_b) do
    init_state = %__MODULE__{player_a: encode(player_a), player_b: encode(player_b)}
    history = MapSet.new()

    play(history, init_state, 0, 0)
  end

  # player a runs out of cards
  defp play(_history, %__MODULE__{player_a: [], turn: :a}, count, tricks), do: {:finished, count, tricks+1}

  # player b runs out of cards
  defp play(_history, %__MODULE__{player_b: [], turn: :b}, count, tricks), do: {:finished, count, tricks+1}

  # player finishes paying a penalty
  defp play(history, %__MODULE__{penalty: 0, paying: true} = state, count, tricks) do
    next_state =
      %__MODULE__{state |
        player_a: player_a_trick(state),
        player_b: player_b_trick(state),
        pile: [],
        turn: change_turn(state.turn),
        paying: false
      }
    play(history, next_state, count, tricks+1)
  end

  # player is paying a penalty
  defp play(history, %__MODULE__{paying: true} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        card = played_card(state)
        next_state = %__MODULE__{state |
          player_a: player_a_deck(state),
          player_b: player_b_deck(state),
          pile: [card | state.pile],
          turn: (if card == 0, do: state.turn, else: change_turn(state.turn)),
          penalty: (if card == 0, do: state.penalty-1, else: card)
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  # player turn
  defp play(history, %__MODULE__{paying: false} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        card = played_card(state)
        next_state = %__MODULE__{state |
          player_a: player_a_deck(state),
          player_b: player_b_deck(state),
          pile: [card | state.pile],
          turn: change_turn(state.turn),
          penalty: card,
          paying: card != 0
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  # add to history and check if state has been seen before
  defp state_lookup(history, state) do
  
    # More efficient, but not deterministic method
    # condensed_state = :crypto.hash(:sha256, :erlang.term_to_binary(state))

    condensed_state = {state.player_a, state.player_b, state.pile, state.penalty, state.turn}
    
    if MapSet.member?(history, condensed_state) do
      :loop
    else
      {:ok, MapSet.put(history, condensed_state)}
    end
  end

  # replaces all number cards with their penalty value
  defp encode(deck) do
    Enum.map(deck, fn
      "A" -> 4
      "K" -> 3
      "Q" -> 2
      "J" -> 1
      _ -> 0
    end)
  end

  # changes the player turn
  defp change_turn(:a), do: :b
  defp change_turn(:b), do: :a

  # updates the player_a deck if it is a's turn
  defp player_a_deck(%__MODULE__{turn: :a, player_a: [_card | cards]}), do: cards
  defp player_a_deck(%__MODULE__{player_a: player_a}), do: player_a

  # updates the player_a deck dependent on someone winning a trick
  defp player_a_trick(%__MODULE__{turn: :a, player_a: player_a}), do: player_a
  defp player_a_trick(%__MODULE__{player_a: player_a, pile: pile}), do: player_a ++ Enum.reverse(pile)

  # updates the player_b deck if it is b's turn
  defp player_b_deck(%__MODULE__{turn: :b, player_b: [_card | cards]}), do: cards
  defp player_b_deck(%__MODULE__{player_b: player_b}), do: player_b

  # updates the player_b deck dependent on someone winning a trick
  defp player_b_trick(%__MODULE__{turn: :b, player_b: player_b}), do: player_b
  defp player_b_trick(%__MODULE__{player_b: player_b, pile: pile}), do: player_b ++ Enum.reverse(pile)

  # gets the card to be played
  defp played_card(%__MODULE__{turn: :a, player_a: [card | _cards]}), do: card
  defp played_card(%__MODULE__{player_b: [card | _cards]}), do: card
end
