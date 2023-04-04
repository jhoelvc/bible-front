import Navbar from "./Navbar";

export function Layout({ children, title}) {
  return (
    <>
      <Navbar children={children} title={title} />
    </>
  );
}