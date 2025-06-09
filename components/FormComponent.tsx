"use client";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/react";
import React from "react";

// export const FormValidation = () => {
//   return (
//     <Form validationBehavior="aria">
//       <Input
//         isRequired
//         label="Username"
//         labelPlacement="outside"
//         name="username"
//         placeholder="Enter your username"
//         validate={(value) => {
//           if (value.length < 3) {
//             return "Username must be at least 3 characters long";
//           }

//           return value === "admin" ? "Nice try!" : null;
//         }}
//       />
//       <Button type="submit">Submit</Button>
//     </Form>
//   );
// };

// input : [a, b, c, [d,e]]
function FormComponent({ headers }: { headers: (string | string[])[] }) {
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <Form
      className="flex flex-col gap-4 w-full max-w-md"
      validationBehavior="aria"
      onSubmit={onSubmit}
    >
      {headers.map((header, index) => {
        if (Array.isArray(header)) {
          return (
            <div key={index} className="flex gap-2">
              {header.map((subHeader, subIndex) => (
                <Input
                  key={`${index}-${subIndex}`}
                  isRequired
                  label={subHeader}
                  labelPlacement="outside"
                  name={subHeader}
                  placeholder={"Enter your " + subHeader}
                  type="text"
                  validate={(value) => {
                    if (value.length < 3) {
                      return subHeader + " must be at least 3 characters long";
                    }

                    return value === "admin" ? "Nice try!" : null;
                  }}
                />
              ))}
            </div>
          );
        }

        return (
          <Input
            key={index}
            isRequired
            label={header}
            labelPlacement="outside"
            name={header}
            placeholder={"Enter your " + header}
            type="text"
            validate={(value) => {
              if (value.length < 3) {
                return header + " must be at least 3 characters long";
              }

              return value === "admin" ? "Nice try!" : null;
            }}
          />
        );
      })}
      <Button type="submit" variant="bordered">
        Submit
      </Button>
    </Form>
  );
}

export default FormComponent;
