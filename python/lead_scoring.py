"""Exemplo público e simplificado de scoring de leads em Python.

A versão real pode combinar dados de CRM, contexto de conversa e classificação por IA.
Nenhuma regra proprietária está exposta aqui.
"""

from dataclasses import dataclass, asdict
from typing import Literal

Priority = Literal["low", "medium", "high"]


@dataclass(frozen=True)
class LeadSignals:
    has_budget: bool = False
    has_urgency: bool = False
    is_decision_maker: bool = False
    problem_clearly_defined: bool = False
    has_valid_contact: bool = False
    requested_solution: str | None = None


def calculate_score(signals: LeadSignals) -> int:
    score = 0
    score += 30 if signals.has_budget else 0
    score += 25 if signals.has_urgency else 0
    score += 20 if signals.is_decision_maker else 0
    score += 15 if signals.problem_clearly_defined else 0
    score += 10 if signals.has_valid_contact else 0
    return max(0, min(score, 100))


def priority_from_score(score: int) -> Priority:
    if score >= 75:
        return "high"
    if score >= 45:
        return "medium"
    return "low"


def route_lead(priority: Priority, requested_solution: str | None) -> str:
    if priority == "high":
        return "automation_specialist" if requested_solution == "automation" else "senior_consultant"
    if priority == "medium":
        return "sales_queue"
    return "nurture_flow"


def qualify(signals: LeadSignals) -> dict:
    score = calculate_score(signals)
    priority = priority_from_score(score)
    return {
        "score": score,
        "priority": priority,
        "qualified": score >= 45,
        "route": route_lead(priority, signals.requested_solution),
        "signals": asdict(signals),
    }
