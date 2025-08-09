import DashboardLayout from "@/app/layouts/DashboardLayout";
import UserView from "@/containers/users/userView";

const UserViewPage = () => {
  return (
    <DashboardLayout>
      <UserView />
    </DashboardLayout>
  );
};

export default UserViewPage;
