import { DM_Mono, DM_Sans } from "next/font/google";

const dm_sans_init = DM_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
    variable: '--font-dm_sans',
});
export const dm_sans = dm_sans_init.variable;

const dm_mono_init = DM_Mono({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-dm_mono',
});
export const dm_mono = dm_mono_init.variable;
