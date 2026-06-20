"""AlphaScore engine for the MarketAlpha FX Command Center MVP.

The module keeps the first product slice intentionally small: currency strength,
economic data, AI news impact, trend confirmation, and smart-money flow combine
into one directional score per currency pair.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


ALPHA_WEIGHTS = {
    "currency_strength": 0.40,
    "economic_data": 0.25,
    "news_impact": 0.15,
    "trend": 0.10,
    "smart_money_flow": 0.10,
}


@dataclass(frozen=True)
class CurrencyInput:
    """Normalized directional inputs for one currency.

    strength is a 0-100 relative currency-strength reading. The other fields are
    directional factors from -10 bearish to +10 bullish, allowing upstream data
    providers and AI classifiers to stay independent from the final score.
    """

    code: str
    strength: float
    economic_data: float = 0.0
    news_impact: float = 0.0
    trend: float = 0.0
    smart_money_flow: float = 0.0


@dataclass(frozen=True)
class MarketInput:
    """MVP inputs for generating a trade opportunity on a currency pair."""

    base: CurrencyInput
    quote: CurrencyInput
    market_mood: str = "neutral"


@dataclass(frozen=True)
class AlphaScoreBreakdown:
    """Weighted score contribution behind a pair decision."""

    currency_strength: float
    economic_data: float
    news_impact: float
    trend: float
    smart_money_flow: float

    @property
    def total(self) -> float:
        return round(
            self.currency_strength
            + self.economic_data
            + self.news_impact
            + self.trend
            + self.smart_money_flow,
            2,
        )


@dataclass(frozen=True)
class TradeOpportunity:
    """Ranked, clutter-free trading answer for the command center."""

    pair: str
    direction: str
    confidence: float
    alpha_score: float
    breakdown: AlphaScoreBreakdown
    reason: tuple[str, ...]


def _clamp(value: float, lower: float = 0.0, upper: float = 100.0) -> float:
    return max(lower, min(upper, value))


def _directional_to_score(delta: float) -> float:
    """Convert a -20..+20 pair delta to a 0..100 score."""

    return _clamp((delta + 20.0) * 2.5)


def _factor_delta(base_value: float, quote_value: float) -> float:
    return _directional_to_score(base_value - quote_value)


def calculate_alpha_score(market: MarketInput) -> AlphaScoreBreakdown:
    """Calculate the weighted AlphaScore components for a pair.

    A score above 80 favors a strong long, below 20 favors a strong short, and
    40-60 marks the no-edge zone.
    """

    base = market.base
    quote = market.quote
    strength_delta_score = _clamp((base.strength - quote.strength + 100.0) / 2.0)

    return AlphaScoreBreakdown(
        currency_strength=round(strength_delta_score * ALPHA_WEIGHTS["currency_strength"], 2),
        economic_data=round(_factor_delta(base.economic_data, quote.economic_data) * ALPHA_WEIGHTS["economic_data"], 2),
        news_impact=round(_factor_delta(base.news_impact, quote.news_impact) * ALPHA_WEIGHTS["news_impact"], 2),
        trend=round(_factor_delta(base.trend, quote.trend) * ALPHA_WEIGHTS["trend"], 2),
        smart_money_flow=round(_factor_delta(base.smart_money_flow, quote.smart_money_flow) * ALPHA_WEIGHTS["smart_money_flow"], 2),
    )


def classify_direction(alpha_score: float) -> str:
    if alpha_score > 80:
        return "Strong Long"
    if alpha_score >= 60:
        return "Long"
    if alpha_score < 20:
        return "Strong Short"
    if alpha_score <= 40:
        return "Short"
    return "Neutral"


def build_trade_opportunity(market: MarketInput) -> TradeOpportunity:
    breakdown = calculate_alpha_score(market)
    alpha_score = breakdown.total
    direction = classify_direction(alpha_score)
    pair = f"{market.base.code}{market.quote.code}"
    confidence = round(abs(alpha_score - 50.0) * 2.0, 2)
    reason = (
        f"{market.base.code} strength {market.base.strength:g} vs {market.quote.code} {market.quote.strength:g}",
        f"Economic data delta {market.base.economic_data - market.quote.economic_data:+g}",
        f"News impact delta {market.base.news_impact - market.quote.news_impact:+g}",
        f"Trend delta {market.base.trend - market.quote.trend:+g}",
        f"Smart money flow delta {market.base.smart_money_flow - market.quote.smart_money_flow:+g}",
    )
    return TradeOpportunity(pair, direction, confidence, alpha_score, breakdown, reason)


def rank_trade_opportunities(markets: Iterable[MarketInput], limit: int = 3) -> list[TradeOpportunity]:
    """Return the highest-conviction non-neutral opportunities."""

    opportunities = [build_trade_opportunity(market) for market in markets]
    tradable = [opportunity for opportunity in opportunities if opportunity.direction != "Neutral"]
    return sorted(tradable, key=lambda item: item.confidence, reverse=True)[:limit]
