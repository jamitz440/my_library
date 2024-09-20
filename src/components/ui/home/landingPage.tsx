import { SignInButton } from "@clerk/nextjs";
import { Card, CardContent, CardFooter } from "../card";
import { Button } from "../button";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faBookOpenCover,
  faHeart,
  faStar,
} from "@awesome.me/kit-30477fcccd/icons/classic/solid";

export const LandingPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-1 flex-col items-center justify-center bg-background px-4">
      <Card className="max-w-lg border-0 text-center shadow-none">
        <CardContent>
          <h1 className="mb-6 text-4xl font-bold">
            Welcome to Your Personal Library
          </h1>
          <p className="mb-8 text-muted-foreground">
            Organize, rate, and wishlist your favorite books. Take control of
            your reading experience.
          </p>
          <div className="mb-6 flex justify-around">
            <Feature
              icon={faBookOpenCover as FontAwesomeIconProps["icon"]}
              label="Track your books"
            />
            <Feature
              icon={faStar as FontAwesomeIconProps["icon"]}
              label="Rate your reads"
            />
            <Feature
              icon={faHeart as FontAwesomeIconProps["icon"]}
              label="Save your wishlist"
            />
          </div>
          <SignInButton>
            <Button className="w-full bg-primary text-white">
              Get Started
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex items-center justify-center text-muted-foreground">
          <p>Join today and start building your dream library.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

const Feature = ({
  icon,
  label,
}: {
  icon: FontAwesomeIconProps["icon"];
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-2 text-primary">
      <FontAwesomeIcon icon={icon} />{" "}
    </div>
    <p className="text-sm font-medium">{label}</p>
  </div>
);
