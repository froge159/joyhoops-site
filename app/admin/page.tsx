import {
  getCoaches, getCoach,
  getOrganizationStats, getQuickSummaryStats} from "./actions"
import AdminDashBoard from "./AdminComponent";

export default async function AdminDashboard() {
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
  const generalCoachData = (await getCoaches()).data ?? [];
  
  const specificCoachPromises = generalCoachData.map((coach) => getCoach(coach.id));
  const specificCoachResults = await Promise.all(specificCoachPromises);
  const specificCoachData = specificCoachResults.map((result) => result.data);
  const filteredSpecificCoachData = specificCoachData.filter((coach): coach is NonNullable<typeof coach> => coach !== undefined) ?? [];

  return (
    <AdminDashBoard 
      initialCoaches={generalCoachData}
      organizationStats={organizationStats}
      quickSummaryStats={quickSummaryStats}
      specificCoachData={filteredSpecificCoachData}>
    </AdminDashBoard>
  )
}