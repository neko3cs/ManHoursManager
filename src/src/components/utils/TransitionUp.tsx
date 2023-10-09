import { Slide, SlideProps } from "@mui/material";

export const TransitionUp = (props: Omit<SlideProps, "direction">) => {
  return (
    <Slide
      {...props}
      direction={"up"} />
  );
}