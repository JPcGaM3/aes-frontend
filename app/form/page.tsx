import FormComponent from "@/components/FormComponent";

function Form() {
  return (
    <div className="flex flex-col gap-8">
      <FormComponent
        headers={[
          ["firstname", "lastname"],
          "username",
          "password",
          "confirm password",
          "address",
          "city",
          "state",
          "phone",
          "email",
        ]}
      />
    </div>
  );
}

export default Form;
