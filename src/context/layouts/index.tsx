import {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router';
import Header from './header';
import Footer from './footer';
import ScrollTop from '../../components/ScrollTop';

export default function Layout() {
  const {pathname, hash} = useLocation();

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
      <Footer />
      <ScrollTop />
    </>
  );
}
