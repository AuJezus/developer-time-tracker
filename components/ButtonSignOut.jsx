import { Button } from "./ui/Button";

function ButtonSignOut() {
  return (
    <form action="/auth/signout" method="post">
      <Button variant="ghost" type="submit">
        Sign out
      </Button>
    </form>
  );
}

export default ButtonSignOut;
