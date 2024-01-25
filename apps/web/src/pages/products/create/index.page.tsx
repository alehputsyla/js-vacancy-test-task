import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RoutePath } from 'routes';
import {
  Button,
  TextInput,
  Stack,
  Title,
  NumberInput,
  rem,
  Group,
  Image,
  FileInput,
  BackgroundImage,
} from '@mantine/core';

import { productApi } from 'resources/product';

import { handleError } from 'utils';

const ONE_MB_IN_BYTES = 1048576;

const schema = z.object({
  price: z.number({ required_error: 'Please enter Price' }),
  title: z.string().min(1, 'Please enter Title').max(32),
  quantity: z.number({ required_error: 'Please enter Quantity' }),
  file: z.any()
    .refine((file: File) => file, 'Please choose product\'s photo')
    .refine((file: File | undefined) => file && file.size / ONE_MB_IN_BYTES < 2, 'Sorry, you cannot upload a photo larger than 2 MB.')
    .refine((file: File | undefined) => file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type), 'Sorry, you can only upload JPG, JPEG or PNG photos.'),
});

type FormValues = z.infer<typeof schema>;

const ProductsCreate: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const {
    mutate: createProduct,
    isLoading: isCreateProductLoading,
  } = productApi.useCreate();

  const {
    mutate: uploadPhoto,
    isLoading: isUploadPhotoLoading,
  } = productApi.useUploadPhoto();

  const onSubmit = (submitData: FormValues) => {
    const { file, ...productData } = submitData;
    const submitFile = new FormData();
    submitFile.append('file', file, file.name);

    uploadPhoto(submitFile, {
      onSuccess: ({ photoUrl }) => {
        createProduct({ ...productData, photoUrl }, {
          onSuccess: () => {
            router.push(RoutePath.Products).then(() => {
              showNotification({
                title: 'Success',
                message: 'Your product has been successfully added.',
                color: 'green',
              });
            });
          },
          onError: (e) => handleError(e, setError),
        });
      },
      onError: (e) => handleError(e, setError),
    });
  };

  const photoInputLabel = (
    <Group style={{ pointerEvents: 'none' }}>
      <BackgroundImage
        src="/images/product-empty-photo.svg"
        w={rem(180)}
        h={rem(180)}
        radius="lg"
        style={{ overflow: 'hidden', pointerEvents: 'auto', cursor: 'pointer' }}
      >
        {watch('file') && <Image w="100%" h="100%" src={URL.createObjectURL(watch('file'))} />}
      </BackgroundImage>
      <Button
        style={{ pointerEvents: 'auto' }}
        variant="outline"
        component="div"
        radius="md"
        fw={500}
      >
        {watch('file') ? 'Change Photo' : 'Upload Photo'}
      </Button>
    </Group>
  );

  return (
    <>
      <Head>
        <title>Products - Create</title>
      </Head>
      <Stack
        maw={rem(694)}
        gap="lg"
      >
        <Title order={1} size="h3">Create new product</Title>

        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack gap="lg">
            <Controller
              control={control}
              name="file"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <FileInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  styles={{
                    wrapper: { display: 'none' },
                    input: { display: 'none' },
                    label: { display: 'block', pointerEvents: 'none' },
                  }}
                  errorProps={{
                    mt: rem(5),
                  }}
                  accept="image/png,image/jpg,image/jpeg"
                  label={photoInputLabel}
                  error={error?.message}
                />
              )}
            />

            <TextInput
              {...register('title')}
              label="Title of the product"
              placeholder="Enter title of the product..."
              labelProps={{
                'data-invalid': !!errors.title,
                mb: 'xs',
              }}
              radius="md"
              error={errors.title?.message}
            />

            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <NumberInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  label="Price"
                  placeholder="Enter price of the product"
                  hideControls
                  labelProps={{
                    'data-invalid': !!error,
                    mb: 'xs',
                  }}
                  radius="md"
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <NumberInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  label="Quantity"
                  placeholder="Enter quantity of the product"
                  hideControls
                  labelProps={{
                    'data-invalid': !!error,
                    mb: 'xs',
                  }}
                  radius="md"
                  error={error?.message}
                />
              )}
            />

            <Group justify="flex-end" mt={rem(8)}>
              <Button
                type="submit"
                loading={isCreateProductLoading && isUploadPhotoLoading}
                radius="md"
              >
                Upload Product
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default ProductsCreate;
