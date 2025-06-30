import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const baseOptions: BaseLayoutProps = {
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
};
