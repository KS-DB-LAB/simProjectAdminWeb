"use client";

import { useState } from "react";
import cn from "classnames";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useAuth, VIEWS } from "src/components/AuthProvider";
import supabase from "src/lib/supabase-browser";
import UserHead from "../UserHead";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignIn = () => {
  const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);

  async function signIn(formData) {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div className="min-h-screen">
      <UserHead />
      <div className="card">
        <h1 className="w-full text-center">서비스를 사용하시려면 로그인하세요.</h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignInSchema}
          onSubmit={signIn}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label htmlFor="email">이메일</label>
              <Field
                className={cn("input", errors.email && touched.email && "bg-red-50")}
                id="email"
                name="email"
                placeholder="example@sim.com"
                type="email"
              />
              {errors.email && touched.email ? (
                <div className="text-red-600">{errors.email}</div>
              ) : null}

              <label htmlFor="email">비밀번호</label>
              <Field
                className={cn("input", errors.password && touched.password && "bg-red-50")}
                id="password"
                name="password"
                type="password"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600">{errors.password}</div>
              ) : null}

              <button className="button mt-4 w-full items-center" type="submit">
                로그인
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        <button
          className="link w-full"
          type="button"
          onClick={() => setView(VIEWS.FORGOTTEN_PASSWORD)}
        >
          비밀번호 찾기
        </button>
        <button className="link w-full" type="button" onClick={() => setView(VIEWS.SIGN_UP)}>
          회원 가입하기
        </button>
      </div>
    </div>
  );
};

export default SignIn;
