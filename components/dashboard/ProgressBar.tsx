import { Progress } from "@/components/ui/progress"
import type { Database } from "@/types/database"

type DailyPost = Database["public"]["Tables"]["daily_posts"]["Row"]

interface Props {
  posts: DailyPost[]
}

export default function ProgressBar({ posts }: Props) {
  const total = posts.length
  const done = posts.filter((p) => p.status === "done").length
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Today&apos;s Progress</span>
        <span className="text-muted-foreground">
          {done} of {total} posted
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      {done === total && total > 0 && (
        <p className="text-sm text-green-600 font-medium">
          All done for today! Come back tomorrow for 5 new opportunities.
        </p>
      )}
    </div>
  )
}
