import { FaGithub, FaFacebook  } from "react-icons/fa";
import Link from "next/link";


export default function Footer() {


    return(

    <footer className="justify-items-center">
        <h2>© SmartCity Monitoring, developed by SmartCity Design Team</h2>

        <div className="flex">

        <Link href={"https://github.com/UBCSmartCity/SmartStreetLight"} className="w-fit"><FaGithub/></Link>
        <Link href={"https://www.facebook.com/ubcsmartcity/"} className="w-fit"><FaFacebook/></Link>
        </div>
        
       
    </footer>
    );
}