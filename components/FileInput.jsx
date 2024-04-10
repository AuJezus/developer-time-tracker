import Image from "next/image";
import { Input } from "./ui/Input";
import { FormControl } from "./ui/Form";

function FileInput({ field }) {
  const imageSrc =
    typeof field.value === "string"
      ? field.value
      : URL.createObjectURL(field.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    field.onChange(file);
  };

  return (
    <div className="flex gap-8 flex-shrink-0">
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:text-primary-foreground text-muted-foreground"
        />
      </FormControl>
      <Image
        className="border-2 rounded-md object-cover aspect-square"
        src={imageSrc}
        alt="Profile picture"
        width={100}
        height={100}
      />
    </div>
  );
}

export default FileInput;
