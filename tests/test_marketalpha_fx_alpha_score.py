from marketalpha_fx.alpha_score import CurrencyInput, MarketInput, rank_trade_opportunities


def test_rank_trade_opportunities_surfaces_top_three_non_neutral_pairs():
    usd = CurrencyInput("USD", 92, economic_data=8, news_impact=7, trend=6, smart_money_flow=8)
    jpy = CurrencyInput("JPY", 20, economic_data=-4, news_impact=-6, trend=-5, smart_money_flow=-7)
    eur = CurrencyInput("EUR", 70, economic_data=-5, news_impact=-4, trend=-3, smart_money_flow=-2)
    gbp = CurrencyInput("GBP", 60, economic_data=2, news_impact=1, trend=1, smart_money_flow=0)
    aud = CurrencyInput("AUD", 35, economic_data=-6, news_impact=-5, trend=-6, smart_money_flow=-4)

    opportunities = rank_trade_opportunities(
        [
            MarketInput(usd, jpy, "risk_off"),
            MarketInput(eur, gbp, "neutral"),
            MarketInput(aud, usd, "risk_off"),
            MarketInput(gbp, jpy, "risk_on"),
        ]
    )

    assert [opportunity.pair for opportunity in opportunities] == ["USDJPY", "AUDUSD", "GBPJPY"]
    assert opportunities[0].direction == "Strong Long"
    assert opportunities[0].alpha_score > 80


def test_no_edge_zone_is_filtered_out():
    eur = CurrencyInput("EUR", 51, economic_data=0, news_impact=0, trend=0, smart_money_flow=0)
    chf = CurrencyInput("CHF", 49, economic_data=0, news_impact=0, trend=0, smart_money_flow=0)

    assert rank_trade_opportunities([MarketInput(eur, chf)]) == []
