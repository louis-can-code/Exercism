defmodule CamiciaState do
  @enforce_keys [:player_a, :player_b]
  defstruct [:player_a, :player_b, pile: [], turn: :a, penalty: 0, paying: false]
end

defmodule Camicia do
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
    init_state = %CamiciaState{player_a: encode(player_a), player_b: encode(player_b)}
    history = MapSet.new()

    play(history, init_state, 0, 0)
  end

  #player a runs out of cards
  defp play(_history, %CamiciaState{player_a: [], turn: :a}, count, tricks), do: {:finished, count, tricks+1}

  #player b runs out of cards
  defp play(_history, %CamiciaState{player_b: [], turn: :b}, count, tricks), do: {:finished, count, tricks+1}

  #player a finishes paying a penalty
  defp play(history, %CamiciaState{turn: :a, penalty: 0, paying: true} = state, count, tricks) do
    next_state =
      %CamiciaState{state |
        player_b: state.player_b ++ Enum.reverse(state.pile),
        pile: [],
        turn: :b,
        paying: false
      }
    play(history, next_state, count, tricks+1)
  end

  #player b finishes paying a penalty
  defp play(history, %CamiciaState{turn: :b, penalty: 0, paying: true} = state, count, tricks) do
    next_state =
      %CamiciaState{state |
        player_a: state.player_a ++ Enum.reverse(state.pile),
        pile: [],
        turn: :a,
        paying: false
      }
    play(history, next_state, count, tricks+1)
  end

  #player a is paying a penalty
  defp play(history, %CamiciaState{player_a: [card | cards], turn: :a, paying: true} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        next_state = %CamiciaState{state |
          player_a: cards,
          pile: [card | state.pile],
          turn: (if card == ".", do: :a, else: :b),
          penalty: (if card == ".", do: state.penalty-1, else: penalty(card))
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  #player b is paying a penalty
  defp play(history, %CamiciaState{player_b: [card | cards], turn: :b, paying: true} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        next_state = %CamiciaState{state |
          player_b: cards,
          pile: [card | state.pile],
          turn: (if card == ".", do: :b, else: :a),
          penalty: (if card == ".", do: state.penalty-1, else: penalty(card))
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  #player a's turn
  defp play(history, %CamiciaState{player_a: [card | cards], turn: :a, paying: false} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        next_state = %CamiciaState{state |
          player_a: cards,
          pile: [card | state.pile],
          turn: :b,
          penalty: penalty(card),
          paying: card != "."
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  #player b's turn
  defp play(history, %CamiciaState{player_b: [card | cards], turn: :b, paying: false} = state, count, tricks) do
    case state_lookup(history, state) do
      :loop -> {:loop, count, tricks}
      {:ok, new_hist} ->
        next_state = %CamiciaState{state |
          player_b: cards,
          pile: [card | state.pile],
          turn: :a,
          penalty: penalty(card),
          paying: card != "."
        }
        play(new_hist, next_state, count+1, tricks)
    end
  end

  #add to history and check if state has been seen before
  defp state_lookup(history, state) do
    hash = :crypto.hash(:sha256, :erlang.term_to_binary(state))
    if MapSet.member?(history, hash) do
      :loop
    else
      {:ok, MapSet.put(history, hash)}
    end
  end

  #replaces all number cards with "."
  defp encode(deck), do: Enum.map(deck, &( if &1 in ["J", "Q", "K", "A"], do: &1, else: "."))

  defp penalty("."), do: 0
  defp penalty("J"), do: 1
  defp penalty("Q"), do: 2
  defp penalty("K"), do: 3
  defp penalty("A"), do: 4
end
