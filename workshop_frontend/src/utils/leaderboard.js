/**
 * Computes a sorted leaderboard from student + attendance + feedback arrays.
 *
 * Scoring formula (max ~90 pts):
 *   attendance score  = Math.round(attPct * 0.7)  → max 70
 *   feedback bonus    = feedback submitted ? 10 : 0
 *   feedback quality  = feedback ? rating * 2 : 0  → max 10
 */
export function computeLeaderboard(students, allAttendance, feedbacks = []) {


  return students
    .map((s) => {
      const att     = allAttendance.filter((a) => String(a.student_id) === String(s.id));
      const total   = att.length;
      const present = att.filter((a) => a.status === "present").length;
      const attPct  = Math.round((present / 7) * 100);

      const feedback  = feedbacks.find((f) => String(f.studentId) === String(s.id));
      const fbBonus   = feedback ? 10 : 0;
      const fbRating  = feedback ? feedback.rating * 2 : 0;
      const score     = Math.round(attPct * 0.7) + fbBonus + fbRating;

      return {
        id:          s.id,
        name:        s.name,
        present,
        total,
        attPct,
        hasFeedback: !!feedback,

        score,
      };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
