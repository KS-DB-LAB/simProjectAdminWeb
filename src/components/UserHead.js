import Image from "next/image";

const UserHead = () => {
  return (
    <div className="flex justify-center">
      <Image src={"/slogan.jpg"} alt="slogan" width={500} height={500} />
    </div>
  );
};

export default UserHead;
