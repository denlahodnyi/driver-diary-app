type AppFonts = Record<
  string,
  {
    [key: string]: string;
    regular: string;
  }
>;

export const appFonts = {
  Poppins: {
    black: 'Poppins-Black',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
    light: 'Poppins-Light',
    medium: 'Poppins-Medium',
    regular: 'Poppins-Regular',
  },
} satisfies AppFonts;
