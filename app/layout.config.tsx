import Image from 'next/image';

export const baseOptions = {
  nav: {
    title: (
      <>
        <Image
          src="/logo.png"
          alt="Recipe Book Logo"
          width={100}
          height={45}
        />
      </>
    ),
  },
  links: [
    {
      text: 'Recipes',
      url: '/recipes',
      secondary: false,
    }
  ],
  // search: {
  //   type: "static",
  //   url: "/search.json",
  // },
};
