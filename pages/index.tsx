import Header from "../components/header";
import { createLink } from "../api/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function IndexPage() {
  const recommendedBusinesses = [
    { name: "Magnetic", url: "https://website-magnetic-ai.vercel.app/" },
    { name: "RickRoll", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];

  const router = useRouter();

  const onCreateLinkClick = async (e: any) => {
    const result = await createLink(e.target.id);
    console.log(result);
    router.push("info/" + result?.data._id);
  };

  const onSearchClick = async (e: any) => {
    e.preventDefault();
    router.push("info/" + e.target.link.value.split("/").pop());
  };

  return (
    <>
      {/* <Header />
      <h1>Hello World!</h1>
      <h2>Pick a business below to become an affiliate marketer</h2>
      <ul>
        {recommendedBusinesses.map((business) => (
          <li>
            <h3>
              <Link href={business.url}>{business.name}</Link>
            </h3>
            <button id={business.url} onClick={onCreateLinkClick}>
              Create Affiliate Link
            </button>
          </li>
        ))}
      </ul>
      <h2>Enter your affiliate link here to check stats</h2>
      <form onSubmit={onSearchClick}>
        <label>Affiliate Link:</label>
        <br />
        <input type="text" id="link" name="link" />
        <br />
        <input type="submit" value="Search" />
      </form> */}
    </>
  );
}
