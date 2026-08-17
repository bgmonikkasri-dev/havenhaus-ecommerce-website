
import React from 'react';
import { useNavigate } from 'react-router-dom';

import background from '../images/havenlogo.png';

import step1 from '../images/room1.webp';
import step2 from '../images/room2.webp';
import step3 from '../images/room3.webp';
import step4 from '../images/room4.webp';

const Home = () => {
  const navigate = useNavigate();

  // =========================
  // HAVENHAUS COLOR PALETTE
  // =========================

  const colors = {
    black: '#171310',
    darkBrown: '#4A2F22',
    brown: '#6F4E37',
    lightBrown: '#8B6B55',
    cream: '#F7F3EF',
    beige: '#EDE4DC',
    white: '#FFFFFF',
    gray: '#66615D',
  };

  // =========================
  // BUTTON STYLES
  // =========================

  const primaryButton = {
    padding: '0.8rem 1.7rem',
    backgroundColor: colors.brown,
    color: colors.white,
    border: `2px solid ${colors.brown}`,
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    fontFamily: '"Times New Roman", Times, serif',
    transition: 'all 0.3s ease',
  };

  const sectionTitle = {
    fontSize: '2.2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: colors.darkBrown,
    fontWeight: 'bold',
  };

  const sectionText = {
    fontSize: '1.2rem',
    color: colors.gray,
    lineHeight: '1.8',
  };

  return (
    <div
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        backgroundColor: colors.white,
        color: colors.black,
        minHeight: '100vh',
      }}
    >

{/* =====================================================
    HERO SECTION
===================================================== */}

<section
  style={{
    minHeight: '78vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.black,
  }}
>
  {/* HavenHaus Background Logo */}
  <img
    src={background}
    alt="HavenHaus"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      objectPosition: 'center',
      zIndex: 0,
    }}
  />

  {/* Dark Overlay */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(rgba(23,19,16,0.48), rgba(74,47,34,0.62))',
      zIndex: 1,
    }}
  />

  {/* Hero Content */}
  <div
    style={{
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: colors.white,
      padding: '30px 20px',
      maxWidth: '900px',
      width: '100%',
    }}
  >
    <p
      style={{
        fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom: '1rem',
      }}
    >
      Welcome to
    </p>

    <h1
      style={{
        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
        margin: '0 0 1rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
      }}
    >
      HavenHaus
    </h1>

    <div
      style={{
        width: '70px',
        height: '2px',
        backgroundColor: colors.white,
        margin: '0 auto 1.5rem',
      }}
    />

    <p
      style={{
        fontSize: 'clamp(1.05rem, 3vw, 1.45rem)',
        maxWidth: '720px',
        margin: '0 auto',
        lineHeight: '1.7',
      }}
    >
      Modern appliances designed to bring comfort,
      convenience, and effortless living into every home.
    </p>
  </div>
</section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        style={{
          backgroundColor: colors.white,
          padding: '5rem 1.5rem',
        }}
      >

        <section
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >


          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <header
            style={{
              marginBottom: '5rem',
              textAlign: 'center',
            }}
          >

            <p
              style={{
                color: colors.brown,
                fontSize: '0.95rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '0.7rem',
              }}
            >
              Comfort. Technology. Home.
            </p>

            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                marginBottom: '1rem',
                fontWeight: 'bold',
                color: colors.darkBrown,
              }}
            >
              Smart Living. Simplified.
            </h2>

            <p
              style={{
                fontSize: '1.25rem',
                maxWidth: '800px',
                margin: '0 auto',
                color: colors.gray,
                lineHeight: '1.8',
              }}
            >
              HavenHaus brings together modern home appliances that
              combine practical technology, timeless design, and
              dependable performance to make everyday living easier.
            </p>

          </header>


          {/* =================================================
              ABOUT HAVENHAUS
          ================================================= */}

          <section
            style={{
              marginBottom: '5rem',
              backgroundColor: colors.cream,
              padding: '3rem 2rem',
              borderRadius: '8px',
              borderLeft: `5px solid ${colors.brown}`,
            }}
          >

            <h3 style={sectionTitle}>
              Designed for Modern Living
            </h3>

            <p
              style={{
                ...sectionText,
                textAlign: 'center',
                maxWidth: '850px',
                margin: '0 auto',
              }}
            >
              At HavenHaus, we believe technology should make your
              home feel more comfortable, convenient, and effortless.
              Our collection brings together appliances designed to
              fit naturally into the rhythm of everyday life.
            </p>

            <p
              style={{
                ...sectionText,
                textAlign: 'center',
                maxWidth: '850px',
                margin: '1.2rem auto 0',
              }}
            >
              From cooling and refrigeration to laundry and cooking,
              HavenHaus focuses on products that balance functionality,
              efficiency, reliability, and modern aesthetics.
            </p>

          </section>


          {/* =================================================
              FOUR APPLIANCE CATEGORIES
          ================================================= */}

          <section
            style={{
              marginBottom: '5rem',
            }}
          >

            <p
              style={{
                textAlign: 'center',
                color: colors.brown,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              Explore Our Range
            </p>

            <h3 style={sectionTitle}>
              Essentials for Every Home
            </h3>

            <p
              style={{
                textAlign: 'center',
                color: colors.gray,
                fontSize: '1.15rem',
                marginBottom: '2.5rem',
              }}
            >
              Thoughtfully selected appliances for modern households.
            </p>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >

              {/* ================= COOLING ================= */}

              <div
                style={{
                  backgroundColor: colors.cream,
                  padding: '1.2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <img
                  src={step1}
                  alt="Cooling Solutions"
                  style={{
                    width: '100%',
                    height: '190px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    display: 'block',
                  }}
                />

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    margin: '1rem 0 0.5rem',
                  }}
                >
                  Cooling Solutions
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  Stay cool and comfortable through every season.
                </p>

              </div>


              {/* ================= REFRIGERATION ================= */}

              <div
                style={{
                  backgroundColor: colors.cream,
                  padding: '1.2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <img
                  src={step2}
                  alt="Smart Refrigeration"
                  style={{
                    width: '100%',
                    height: '190px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    display: 'block',
                  }}
                />

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    margin: '1rem 0 0.5rem',
                  }}
                >
                  Smart Refrigeration
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  Keep food fresher with efficient refrigeration
                  solutions.
                </p>

              </div>


              {/* ================= LAUNDRY ================= */}

              <div
                style={{
                  backgroundColor: colors.cream,
                  padding: '1.2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <img
                  src={step3}
                  alt="Laundry Care"
                  style={{
                    width: '100%',
                    height: '190px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    display: 'block',
                  }}
                />

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    margin: '1rem 0 0.5rem',
                  }}
                >
                  Laundry Care
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  Make laundry day easier with practical appliances.
                </p>

              </div>


              {/* ================= COOKING ================= */}

              <div
                style={{
                  backgroundColor: colors.cream,
                  padding: '1.2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <img
                  src={step4}
                  alt="Cooking Appliances"
                  style={{
                    width: '100%',
                    height: '190px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    display: 'block',
                  }}
                />

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    margin: '1rem 0 0.5rem',
                  }}
                >
                  Quick Cooking
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  Convenient cooking solutions for busy lifestyles.
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              SHOP BY ROOM
          ================================================= */}

          <section
            style={{
              marginBottom: '5rem',
            }}
          >

            <p
              style={{
                textAlign: 'center',
                color: colors.brown,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              Find Your Fit
            </p>

            <h3 style={sectionTitle}>
              Shop by Room
            </h3>

            <p
              style={{
                textAlign: 'center',
                color: colors.gray,
                fontSize: '1.15rem',
                marginBottom: '2.5rem',
              }}
            >
              Appliances designed around the spaces you live in.
            </p>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1rem',
              }}
            >

              {/* LIVING ROOM */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: colors.darkBrown,
                  color: colors.white,
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >

                <h4
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  Living Room
                </h4>

                <p
                  style={{
                    lineHeight: '1.7',
                    margin: 0,
                    color: '#E8E0DA',
                  }}
                >
                  Air conditioners, fans, air purifiers,
                  and comfort essentials.
                </p>

              </div>


              {/* KITCHEN */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: colors.cream,
                  color: colors.black,
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <h4
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.8rem',
                    color: colors.darkBrown,
                  }}
                >
                  Kitchen
                </h4>

                <p
                  style={{
                    lineHeight: '1.7',
                    margin: 0,
                    color: colors.gray,
                  }}
                >
                  Refrigerators, ovens, microwaves,
                  and kitchen essentials.
                </p>

              </div>


              {/* LAUNDRY */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: colors.darkBrown,
                  color: colors.white,
                  borderRadius: '6px',
                  textAlign: 'center',
                }}
              >

                <h4
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.8rem',
                  }}
                >
                  Laundry
                </h4>

                <p
                  style={{
                    lineHeight: '1.7',
                    margin: 0,
                    color: '#E8E0DA',
                  }}
                >
                  Washing machines, dryers,
                  and laundry care essentials.
                </p>

              </div>


              {/* BEDROOM */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: colors.cream,
                  color: colors.black,
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: `1px solid ${colors.beige}`,
                }}
              >

                <h4
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.8rem',
                    color: colors.darkBrown,
                  }}
                >
                  Bedroom
                </h4>

                <p
                  style={{
                    lineHeight: '1.7',
                    margin: 0,
                    color: colors.gray,
                  }}
                >
                  ACs, air coolers, humidifiers,
                  and comfort essentials.
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              CORE VALUES
          ================================================= */}

          <section
            style={{
              marginBottom: '3rem',
            }}
          >

            <p
              style={{
                textAlign: 'center',
                color: colors.brown,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontSize: '0.95rem',
                marginBottom: '0.5rem',
              }}
            >
              The HavenHaus Difference
            </p>

            <h3 style={sectionTitle}>
              Built Around Your Home
            </h3>

            <p
              style={{
                textAlign: 'center',
                color: colors.gray,
                fontSize: '1.15rem',
                maxWidth: '750px',
                margin: '0 auto 2.5rem',
                lineHeight: '1.7',
              }}
            >
              Every HavenHaus experience is built around making
              modern living simpler, smarter, and more comfortable.
            </p>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
              }}
            >

              {/* ENERGY */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  border: `1px solid ${colors.beige}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: colors.white,
                }}
              >

                <div
                  style={{
                    fontSize: '2rem',
                    color: colors.brown,
                    marginBottom: '1rem',
                  }}
                >
                  ⚡
                </div>

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    marginBottom: '0.8rem',
                  }}
                >
                  Energy Conscious
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Appliances selected with efficiency and
                  responsible energy use in mind.
                </p>

              </div>


              {/* TECHNOLOGY */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  border: `1px solid ${colors.beige}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: colors.cream,
                }}
              >

                <div
                  style={{
                    fontSize: '2rem',
                    color: colors.brown,
                    marginBottom: '1rem',
                  }}
                >
                  ✦
                </div>

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    marginBottom: '0.8rem',
                  }}
                >
                  Modern Technology
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Practical technology designed to make
                  everyday routines easier.
                </p>

              </div>


              {/* QUALITY */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  border: `1px solid ${colors.beige}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: colors.white,
                }}
              >

                <div
                  style={{
                    fontSize: '2rem',
                    color: colors.brown,
                    marginBottom: '1rem',
                  }}
                >
                  ✓
                </div>

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    marginBottom: '0.8rem',
                  }}
                >
                  Reliable Quality
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  Products chosen for dependable performance,
                  durability, and value.
                </p>

              </div>


              {/* CUSTOMER FIRST */}

              <div
                style={{
                  padding: '2rem 1.5rem',
                  border: `1px solid ${colors.beige}`,
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: colors.cream,
                }}
              >

                <div
                  style={{
                    fontSize: '2rem',
                    color: colors.brown,
                    marginBottom: '1rem',
                  }}
                >
                  ♡
                </div>

                <h4
                  style={{
                    fontSize: '1.4rem',
                    color: colors.darkBrown,
                    marginBottom: '0.8rem',
                  }}
                >
                  Customer First
                </h4>

                <p
                  style={{
                    color: colors.gray,
                    lineHeight: '1.7',
                    margin: 0,
                  }}
                >
                  A straightforward experience designed around
                  the needs of every household.
                </p>

              </div>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
};

export default Home;
