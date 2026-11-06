import {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router';
import Header from './header';
import Footer from './footer';
import ScrollTop from '../../components/ScrollTop';
import MobileAction, {useMobileAction} from './MobileAction';

export default function Layout() {
  const {pathname, hash} = useLocation();
  const bar = useMobileAction();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    document.querySelector(hash)?.scrollIntoView({behavior: 'smooth'});
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <Outlet />
      {/* Room at the foot of the page so the phone action bar never covers the footer. */}
      <div className={bar ? 'pb-[76px] min-[640px]:pb-0' : undefined}>
        <Footer />
      </div>
      <ScrollTop raised={bar} />
      <MobileAction />
    </>
  );
}
