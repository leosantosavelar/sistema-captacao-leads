import unittest

from lead_scoring import LeadSignals, calculate_score, priority_from_score, qualify


class LeadScoringTests(unittest.TestCase):
    def test_strong_lead_scores_100(self):
        signals = LeadSignals(
            has_budget=True,
            has_urgency=True,
            is_decision_maker=True,
            problem_clearly_defined=True,
            has_valid_contact=True,
            requested_solution="automation",
        )
        self.assertEqual(calculate_score(signals), 100)

    def test_priority_mapping(self):
        self.assertEqual(priority_from_score(80), "high")
        self.assertEqual(priority_from_score(50), "medium")
        self.assertEqual(priority_from_score(20), "low")

    def test_medium_lead_is_qualified(self):
        result = qualify(
            LeadSignals(
                has_budget=True,
                problem_clearly_defined=True,
                has_valid_contact=True,
                requested_solution="crm",
            )
        )
        self.assertEqual(result["score"], 55)
        self.assertEqual(result["priority"], "medium")
        self.assertTrue(result["qualified"])
        self.assertEqual(result["route"], "sales_queue")

    def test_weak_lead_goes_to_nurture(self):
        result = qualify(LeadSignals(has_valid_contact=True, requested_solution="automation"))
        self.assertEqual(result["score"], 10)
        self.assertFalse(result["qualified"])
        self.assertEqual(result["route"], "nurture_flow")


if __name__ == "__main__":
    unittest.main()
