import {addClass, getClasses, editClass, deleteClass, 
  getCoaches, getCoach, addCoach, editCoach, deleteCoach,
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
  const specificCoachData = [];
  for (let coach of generalCoachData) {
    specificCoachData.push((await getCoach(coach.id)).data);
  }
  const filteredSpecificCoachData = specificCoachData.filter((coach): coach is NonNullable<typeof coach> => coach !== undefined);

  return (
    <AdminDashBoard 
    initialCoaches={generalCoachData}
    organizationStats={organizationStats}
    quickSummaryStats={quickSummaryStats}
    specificCoachData={filteredSpecificCoachData}>
    </AdminDashBoard>
  )
}