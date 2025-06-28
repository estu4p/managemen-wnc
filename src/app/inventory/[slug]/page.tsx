import HeaderPage from "@/components/HeaderPage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default async function InventoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage title={cn("Edit ", slug, " Item")} desc="" calendar={false} />
      <div>
        <Card className="min-w-[290px] py-3 rounded-md flex gap-3">
          <CardHeader className="font-medium px-4 gap-0 pb-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base">Item Details</h3>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button>Save</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Separator className="my-2" />
          </CardHeader>
          <CardContent className="px-4 space-y-2 mt-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={slug} className="w-full" />
            <div className="flex items-center justify-between mt-6 gap-3 flex-col md:flex-row">
              <div className="space-y-2 w-full">
                <Label htmlFor="category">Category</Label>
                {/* <Input id="itemName" value={slug} className="w-[98%]" /> */}
                <Select
                //   value={}
                // onValueChange={(value) =>
                //   handleItemChange(item.id, "category", value)
                // }
                >
                  <SelectTrigger className="w-[98%]">
                    <SelectValue placeholder="Item category" />
                  </SelectTrigger>
                  <SelectContent id="category">
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                    <SelectItem value="helmet">Helmet</SelectItem>
                    <SelectItem value="sandals">Saldals</SelectItem>
                    <SelectItem value="hat">Hat</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full mt-3 md:mt-0">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="Item Price"
                  className="w-[98%]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 gap-3 flex-col md:flex-row">
              <div className="space-y-2 w-full">
                <Label htmlFor="initialStock">Initial Stock</Label>
                <Input
                  id="initialStock"
                  placeholder="Initial Stock"
                  className="w-[98%]"
                />
              </div>
              <div className="space-y-2 w-full mt-3 md:mt-0">
                <Label htmlFor="remainingStock">Remaining Stock</Label>
                <Input
                  id="remainingStock"
                  placeholder="Remaining Stock"
                  className="w-[98%]"
                />
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="itemImages">Item Images</Label>
              <Image
                alt="Item Images"
                src="/images/shoe.jpeg"
                width={250}
                height={250}
                className="w-[200px] h-[200px] object-cover mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
