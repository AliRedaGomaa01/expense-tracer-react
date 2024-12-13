import DeleteUserForm from "../components/Profile/DeleteUserForm";
import UpdatePasswordForm from "../components/Profile/UpdatePasswordForm";
import UpdateProfileInformationForm from "../components/Profile/UpdateProfileInformationForm";


export default function Profile(  ) {
  const formContainerClass = "rounded-lg border-2 w-full p-4 w-full bg-my-grad shadow-my-rounded space-y-4";

  return (
    <>
      <div className="grid items-center justify-items-center gap-10 w-full max-w-[700px]" id="transparent-parent">
        <div className={formContainerClass}>
          <UpdateProfileInformationForm />
        </div>

        <div className={formContainerClass}>
          <UpdatePasswordForm />
        </div>

        <div className={formContainerClass}>
          <DeleteUserForm />
        </div>
      </div>
    </>
  );
}
