"use client";

import { useState } from "react";
import cn from "classnames";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Modal, Button } from "flowbite-react";

import { useAuth, VIEWS } from "src/components/AuthProvider";
import supabase from "src/lib/supabase-browser";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ResetPassword = () => {
  const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [modal, setModal] = useState(false);

  async function resetPassword(formData) {
    setModal(true);
    const { error } = await supabase.auth.resetPasswordForEmail(formData?.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_BASE_URL}`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("비밀번호 재설정 링크를 보내드렸습니다. 이메일을 확인해주세요.");
    }
  }

  const handleCloseModal = () => {
    setModal(false);
    setView(VIEWS.SIGN_IN);
  };

  return (
    <div className="min-h-screen">
      <>
        <Modal show={modal} size="md" onClose={() => setModal(false)} popup={true}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {successMsg ? (
                  <>
                    <p>비밀번호 초기화 링크를 보내드렸습니다.</p>
                    <p>이메일을 확인해주세요.</p>
                  </>
                ) : (
                  "잠시 기다려 주세요."
                )}
              </h3>
              <div className="flex justify-center gap-4">
                <Button onClick={handleCloseModal}>로그인 하기</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
      <div className="card">
        <h2 className="w-full text-center">Forgot Password</h2>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={ResetPasswordSchema}
          onSubmit={resetPassword}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label htmlFor="email">이메일</label>
              <Field
                className={cn("input", errors.email && "bg-red-50")}
                id="email"
                name="email"
                placeholder="example@sim.com"
                type="email"
              />
              {errors.email && touched.email ? (
                <div className="text-red-600">{errors.email}</div>
              ) : null}
              <button className="button w-full" type="submit">
                비밀번호 재설정 링크 보내기
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-center text-red-600">{errorMsg}</div>}
        {successMsg && <div className="text-center text-black">{successMsg}</div>}
        <button className="link" type="button" onClick={() => setView(VIEWS.SIGN_IN)}>
          비밀번호가 기억나시나요? 로그인 하러가기
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
