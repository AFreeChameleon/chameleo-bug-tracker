import React from 'react';
import { NextPage } from 'next';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HeroTransition from '../components/landing/HeroTransition';
import OpenBeta from '../components/landing/OpenBeta';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import Alerts from '../components/Alerts';

const Index: NextPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <HeroTransition />
            <OpenBeta />
            <Contact />
            <Footer />
            <Alerts />
        </div>
    )
}

Index.displayName = 'Index';

export default Index;