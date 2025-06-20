import * as yup from "yup";
import Cookies from "universal-cookie";
import { PEOPLE_IMAGES } from "../../images";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type SubmitHandler } from "react-hook-form";
import { StreamVideoClient, type User } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { useNavigate } from "react-router-dom";

interface FormValues {
  username: string;
  name: string;
}

const SignInPage = () => {
  const cookies = new Cookies();
  const { setClient, setUser } = useUser();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    name: yup.string().required("Name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      name: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data, event) => {
    event?.preventDefault();
    const { username, name } = data;

    const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        name,
        image: PEOPLE_IMAGES[Math.floor(Math.random() * PEOPLE_IMAGES.length)],
      }),
    });

    if (!response.ok) {
      alert("Some error occurred while signing in");
      return;
    }

    const responseData = await response.json();

    const user: User = {
      id: username,
      name,
    };

    const myClient = new StreamVideoClient({
      apiKey: import.meta.env.VITE_STREAM_API_KEY || "",
      user,
      token: responseData.token,
    });
    setClient(myClient);
    setUser({ username, name });

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    cookies.set("token", responseData.token, { path: "/", expires });
    cookies.set("username", responseData.username, { path: "/", expires });
    cookies.set("name", responseData.name, { path: "/", expires });

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign in</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              {...register("username")}
              placeholder="Username"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Full Name"
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {/* <div className="text-right text-xs text-blue-600 mt-1 cursor-pointer">Forgot password?</div> */}
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold"
          >
            Sign in
          </button>
        </form>
        {/* <div className="my-6 flex items-center justify-center text-sm text-gray-500">
          <span className="px-2">or continue with</span>
        </div>
        <div className="flex justify-between gap-3">
          <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md text-sm font-medium">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" /> Google
          </button>
          <button className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-md text-sm font-medium">
            <img src="https://www.svgrepo.com/show/473617/github.svg" alt="GitHub" className="w-5 h-5 mr-2" /> GitHub
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SignInPage;
