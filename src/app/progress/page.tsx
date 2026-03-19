import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Placeholder data until DB is connected
const stats = {
  totalAttempts: 42,
  wordsMastered: 8,
  averageScore: 3.6,
  totalWords: 15,
};

const phonemeMastery = [
  { label: "OO fronting", mastery: 80 },
  { label: "T glottalization", mastery: 65 },
  { label: "R rolling", mastery: 45 },
  { label: "CH lenition", mastery: 30 },
  { label: "Monophthongization", mastery: 55 },
];

export default function ProgressPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <h2 className="text-2xl font-bold">Your Progress</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl">{stats.totalAttempts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Words Mastered</CardDescription>
            <CardTitle className="text-3xl">
              {stats.wordsMastered}/{stats.totalWords}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">
              {stats.averageScore.toFixed(1)}/5
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Mastery Rate</CardDescription>
            <CardTitle className="text-3xl">
              {stats.totalWords > 0
                ? Math.round((stats.wordsMastered / stats.totalWords) * 100)
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phoneme Mastery</CardTitle>
          <CardDescription>
            Your progress on individual Scottish accent phoneme shifts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {phonemeMastery.map((phoneme) => (
            <div key={phoneme.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{phoneme.label}</span>
                <span className="text-muted-foreground">
                  {phoneme.mastery}%
                </span>
              </div>
              <Progress value={phoneme.mastery} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
