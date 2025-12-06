import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../../features/auth/slice";
import { Link } from "react-router-dom";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  return (
    <div className="welcome-container">
      {token ? (
        <div>
          {" "}
          <h2>Welcome back, {user.fullName}!</h2>
          <p>Your token: {token}</p>
        </div>
      ) : (
        <div>
          <h2>Welcome to Our Application!</h2>
          <p>
            Please <Link to="/login">log in</Link> to continue.
          </p>
        </div>
      )}
    </div>
  );
};
export default Welcome;
