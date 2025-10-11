import {
  getCoaches, getClasses,
  getOrganizationStats, getQuickSummaryStats} from "./actions"
import AdminDashBoard from "./AdminComponent";

export default async function AdminDashboard() {
  const generalCoachData = (await getCoaches()).data ?? [];
  const classData = (await getClasses()).data ?? [];
  const organizationStats = (await getOrganizationStats()).data ?? {
    totalHours: 0,
    classesDelivered: 0,
    uniqueChildren: 0,
    activeCoaches: 0,
    totalActiveClasses: 0,
  };
  
  const quickSummaryStats = (await getQuickSummaryStats()).data ?? {
    avgHoursPerCoach: 0,
    avgClassesPerCoach: 0,
    avgChildrenPerClass: 0
  };

  return (
    <AdminDashBoard
      coaches={generalCoachData.filter((coach): coach is NonNullable<typeof coach> => coach !== undefined)}
      organizationStats={organizationStats}
      quickSummaryStats={quickSummaryStats}
      classes={classData.filter((cls): cls is NonNullable<typeof cls> => cls !== undefined)}
    />
  )
}