import { getClasses} from "./actions"
import AdminDashBoard from "./AdminComponent";

export default async function AdminDashboard() {
  const classData = (await getClasses()).data ?? [];

  return (
    <AdminDashBoard
      classes={classData.filter((cls): cls is NonNullable<typeof cls> => cls !== undefined)}
    />
  )
}
