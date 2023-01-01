import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

import Link from "next/link";

const Home = () => {
  return (
    <>
      <Link href="/graph/1/0">Go</Link>
    </>
  );
};

export default Home;
