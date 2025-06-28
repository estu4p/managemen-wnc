import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "../ui/separator";

const DetailsNote = ({
  merk,
  color,
  materials,
  size = "-",
  notes = "-",
  photoBefore,
}: {
  merk: string;
  color: string;
  materials: string;
  size?: string;
  notes?: string;
  photoBefore?: string;
}) => {
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4 mt-2 w-full text-sm">
        <div className="">
          <h3>Merk</h3>
          <p className="font-medium capitalize">{merk}</p>
        </div>
        <div className="">
          <h3>Color</h3>
          <p className="font-medium capitalize">{color}</p>
        </div>
        <div className="">
          <h3>Materials</h3>
          <p className="font-medium capitalize">{materials}</p>
        </div>
        <div className="">
          <h3>Size (UK)</h3>
          <p className="font-medium">{size}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3>Notes</h3>
        <p className="text-muted-foreground">{notes}</p>
      </div>
      <Separator className="mb-4 mt-1" />
      <h3 className="font-medium">Photo Before</h3>
      <div className="w-full flex items-center justify-center mt-3">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-sm"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <div className="">
                  <Card className="p-0">
                    <CardContent className="aspect-square p-0">
                      <div className="rounded-md overflow-hidden">
                        <Image
                          src="/images/shoe.jpeg"
                          alt="placeholder"
                          width={120}
                          height={120}
                          className="object-cover w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="max-sm:absolute -top-[23px] max-[408px]:left-60 left-72 sm:left-full ">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default DetailsNote;
