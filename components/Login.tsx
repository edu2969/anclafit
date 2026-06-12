"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getSession, signIn } from "next-auth/react";

interface LoginProps {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginProps>({
    defaultValues: {
      email: '',
      password: '',
    }
  });
  const router = useRouter();
  const onSubmit = async (data: LoginProps) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      return;
    }

    const session = await getSession();

    if (session?.user.role === "ENTRENADOR") {
      router.push("/reserva/entrenador");
    } else {
      router.push("/reserva/deportista");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white text-xl"
      style={{
        backgroundImage: 'url(/bgs/bg-01.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      <div className="bg-gray-400 w-full h-screen absolute top-0 left-0 opacity-10 z-0"></div>
      <div className="py-8 w-full max-w-sm z-10 px-12">
        <div className="absolute w-9 h-120 left-0 top-1/4" style={{ background: 'url(/banda.png)', backgroundSize: 'cover' }}></div>
        <div className="text-center mb-6">
          <img src="/brand.png" alt="AnclaFit Logo" className="mx-auto mb-4 w-28 h-32" />
          <h1 className="text-4xl font-bold">AnclaFit</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 relative w-full h-16">
            <div className="absolute top-1 left-1 w-full h-full border-3 border-gray-700 rounded-2xl" />
            <input
              type="email"
              id="email"
              {...register('email', { required: true })}
              required
              placeholder="Enter your email"
              className="relative z-10 w-full h-full px-4 border-2 border-[#D5D318] rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div className="mb-4 relative w-full h-16">
            <div className="absolute top-1 left-1 w-full h-full border-3 border-gray-700 rounded-2xl" />
            <input
              type="password"
              id="password"
              {...register('password', { required: true })}
              required
              className="relative z-10 w-full h-full px-4 border-2 border-[#D5D318] rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#D5D318] text-white py-4 px-4 rounded-2xl hover:bg-[#C4C216] focus:outline-none focus:ring-2 focus:ring-white"
          >
            login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;