import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Title,
  Text,
  Checkbox,
  SimpleGrid,
  rem,
} from '@mantine/core';

import { accountApi } from 'resources/account';

import config from 'config';
import { Link } from 'components';
import { handleError } from 'utils';
import { RoutePath } from 'routes';

import { EMAIL_REGEX, PASSWORD_REGEX } from 'app-constants';

const schema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Email format is incorrect.'),
  password: z.string().regex(PASSWORD_REGEX, 'The password must contain 8 or more characters with at least one number (0-9) and one lover and capital case letter (a-z, A-Z).'),
});

type SignUpParams = z.infer<typeof schema>;

const passwordRules = [
  {
    title: 'Must be at least 8 characters',
    done: false,
  },
  {
    title: 'Must contain at least 1 number',
    done: false,
  },
  {
    title: 'Must contain lover case and capital letters',
    done: false,
  },
];

const SignUp: NextPage = () => {
  const [email, setEmail] = useState('');
  const [registered, setRegistered] = useState(false);
  const [signupToken, setSignupToken] = useState();

  const [passwordRulesData, setPasswordRulesData] = useState(passwordRules);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    const updatedPasswordRulesData = [...passwordRules];

    updatedPasswordRulesData[0].done = passwordValue.length >= 8 && passwordValue.length <= 32;
    updatedPasswordRulesData[1].done = /\d/.test(passwordValue);
    updatedPasswordRulesData[2].done = /(?=.*[a-z])(?=.*[A-Z])/.test(passwordValue);

    setPasswordRulesData(updatedPasswordRulesData);
  }, [passwordValue]);

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: (response: any) => {
      if (response.signupToken) setSignupToken(response.signupToken);

      setRegistered(true);
      setEmail(data.email);
    },
    onError: (e) => handleError(e, setError),
  });

  if (registered) {
    return (
      <>
        <Head>
          <title>Sign up</title>
        </Head>

        <Stack w={rem(408)}>
          <Title order={2}>Thanks!</Title>

          <Text size="md" c="gray.6">
            Please follow the instructions from the email to complete a sign up process.
            We sent an email with a confirmation link to
            {' '}
            <b>{email}</b>
          </Text>

          {signupToken && (
            <Stack gap={0}>
              <Text>You look like a cool developer.</Text>
              <Link size="sm" href={`${config.API_URL}/account/verify-email?token=${signupToken}`}>
                Verify email
              </Link>
            </Stack>
          )}
        </Stack>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>

      <Stack w={rem(408)} gap="xl">
        <Title order={1} size="h2">Sign Up</Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Email address"
              error={errors.email?.message}
              labelProps={{
                mb: 'xs',
                fw: 600,
              }}
            />

            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="Enter password"
              error={errors.password?.message}
              labelProps={{
                mb: 'xs',
                fw: 600,
              }}
            />

            <SimpleGrid
              cols={1}
              spacing="xs"
            >
              {passwordRulesData.map((ruleData) => (
                <Checkbox
                  key={ruleData.title}
                  checked={ruleData.done}
                  label={ruleData.title}
                  variant="outline-custom"
                  radius="xl"
                  size="md"
                  c="dimmed"
                />
              ))}
            </SimpleGrid>

          </Stack>

          <Button
            type="submit"
            loading={isSignUpLoading}
            fullWidth
            mt="xl"
          >
            Create Account
          </Button>
        </form>

        <Group fz="md" justify="center" gap="xs">
          Have an account?
          <Link
            type="router"
            href={RoutePath.SignIn}
            inherit
            underline={false}
          >
            Sign In
          </Link>
        </Group>
      </Stack>
    </>
  );
};

export default SignUp;
