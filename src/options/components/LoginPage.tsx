import { FormikHelpers, Formik, Form, FormikErrors } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";

import { login } from "src/common/firebase";
import { GetMessage } from "src/common/helpers";
import ExternalLink from "src/options/components/common/ExternalLink";
import TextField from "src/options/components/common/TextField";
import { IAppState } from "src/types";

type LoginDetails = {
  emailAddress: string;
  password: string;
};

const validate = (values: LoginDetails): FormikErrors<LoginDetails> => {
  const errors: FormikErrors<LoginDetails> = {};

  if (!values.emailAddress || values.emailAddress.trim().length === 0) {
    errors.emailAddress = "Введите адрес эл. почты";
  }

  if (!values.password) {
    errors.password = "Введите пароль";
  }

  return errors;
};

const LoginPage = () => {
  const history = useHistory();
  const isLoggedIn = useSelector<IAppState, boolean>((state) => !!state.authData.user);

  const initialValues: LoginDetails = {
    emailAddress: "",
    password: "",
  };

  function handleSubmit(values: LoginDetails, helpers: FormikHelpers<LoginDetails>) {
    helpers.setSubmitting(true);
    login(values.emailAddress, values.password)
      .then((user) => {
        if (!user) {
          helpers.setFieldError("emailAddress", GetMessage("account_error_errorFetchingAccount"));
        } else {
          history.push("/account");
        }
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          helpers.setFieldError("emailAddress", GetMessage("account_error_noAccount"));
        } else if (error.code === "auth/wrong-password") {
          helpers.setFieldError("password", GetMessage("account_error_incorrectPassword"));
        } else {
          helpers.setFieldError("emailAddress", `${GetMessage("account_error_unknownLoginError")} (${error.code})`);
        }
        helpers.setSubmitting(false);
      });
  }

  if (isLoggedIn) {
    return <Redirect to="/account" />;
  }

  return (
    <>
      <h2>Войти в аккаунт</h2>
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <p>Введите адрес эл. почты и пароль для активации подписки Fake Filler Pro.</p>
          <p>
          Вход в систему позволит синхронизировать настройки. Ваши данные используются только для синхронизации. Больше информации: {" "}
            <ExternalLink url="https://fakefiller.com/privacy">Политика конфиденциальности</ExternalLink>.
          </p>
          <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
            {({ isSubmitting, isValid }) => (
              <Form>
                <div className="form-group">
                  <TextField name="emailAddress" placeholder={GetMessage("account_emailAddress")} type="email" />
                </div>
                <div className="form-group">
                  <TextField name="password" placeholder={GetMessage("account_password")} type="password" />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || !isValid}>
                  {GetMessage("account_login")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="col-lg-7 offset-lg-1 col-md-6">
          <div className="bg-light p-3 rounded mt-4 mt-md-0">
            <p>
              <b>Нет аккаунта?</b>
            </p>
            <p>Купите подписку Fake Filler Pro, чтобы:</p>
            <ul>
              <li>Добавлять неограниченное количество польз. полей</li>
              <li>Синхронизировать настройки между браузерами</li>
              <li>Добавлять поля по URL (несколько профилей)</li>
            </ul>
            <p>
              <a href="https://fakefiller.com/#pricing" className="btn btn-primary">
                Купить подписку
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
