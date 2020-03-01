<template>
<div>
  <div class="preloader">
    <div class="preloader-body">
      <div class="preloader-item">
        <div class="diamond"></div>
        <div class="diamond"></div>
        <div class="diamond"></div>
      </div>
    </div>
  </div>
  <div class="page">
    <!-- Page Header-->
    <header class="section page-header">
      <!-- RD Navbar-->
      <div class="rd-navbar-wrap rd-navbar-transparent">
        <nav class="rd-navbar rd-navbar-classic" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-fixed" data-lg-device-layout="rd-navbar-fixed" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-xxl-layout="rd-navbar-static" data-xxl-device-layout="rd-navbar-static" data-lg-stick-up-offset="40px" data-xl-stick-up-offset="40px" data-xxl-stick-up-offset="40px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true">
          <div class="rd-navbar-main">
            <!-- RD Navbar Panel-->
            <div class="rd-navbar-panel">
              <!-- RD Navbar Toggle-->
              <button class="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-outer"><span></span></button>
              <!-- RD Navbar Brand-->
              <div class="rd-navbar-brand"><a class="brand" href="index.html"><img class="brand-logo-dark" src="index/images/logo-default-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-default-210x76.png 2x"/><img class="brand-logo-light" src="index/images/logo-inverse-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-inverse-210x76.png 2x"/></a>
              </div>
              <div class="rd-sidebar">
                <button class="rd-sidebar__button" data-rd-navbar-toggle="#rd-sidebar__list">
                  <svg class="rd-sidebar__shape" version="1.1" x="0px" y="0px" width="28px" height="27px" viewbox="0 0 28 27">
                    <path d="M10,7c0,1.657-1.343,3-3,3H3c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h4c1.657,0,3,1.343,3,3V7z"></path>
                    <path d="M28,7c0,1.657-1.343,3-3,3h-4c-1.657,0-3-1.343-3-3V3c0-1.657,1.343-3,3-3h4c1.657,0,3,1.343,3,3V7z"></path>
                    <path d="M10,24c0,1.657-1.343,3-3,3H3c-1.657,0-3-1.343-3-3v-4c0-1.657,1.343-3,3-3h4c1.657,0,3,1.343,3,3V24z"></path>
                    <path d="M28,24c0,1.657-1.343,3-3,3h-4c-1.657,0-3-1.343-3-3v-4c0-1.657,1.343-3,3-3h4c1.657,0,3,1.343,3,3V24z"></path>
                  </svg>
                </button>
                <ul class="rd-sidebar__list context-dark" id="rd-sidebar__list">
                  <li class="rd-sidebar__list-item">
                    <div class="rd-sidebar__list-item-inner">
                      <div class="icon rd-sidebar__list-item-icon linearicons-envelope"></div>
                      <div class="rd-sidebar__list-item-main"><a class="rd-sidebar__list-item-link" href="contacts.html">Our Contacts</a></div>
                    </div>
                  </li>
                  <li class="rd-sidebar__list-item">
                    <div class="rd-sidebar__list-item-inner">
                      <div class="icon rd-sidebar__list-item-icon linearicons-cash-dollar"></div>
                      <div class="rd-sidebar__list-item-main"><a class="rd-sidebar__list-item-link" href="#">Create a Wallet</a></div>
                    </div>
                  </li>
                  <li class="rd-sidebar__list-item">
                    <div class="rd-sidebar__list-item-inner">
                      <div class="icon rd-sidebar__list-item-icon linearicons-share2"></div>
                      <div class="rd-sidebar__list-item-main">
                        <ul class="list-inline list-inline-xs">
                          <li><a class="icon icon-md link-light mdi mdi-facebook" href="#"></a></li>
                          <li><a class="icon icon-md link-light mdi mdi-twitter" href="#"></a></li>
                          <li><a class="icon icon-md link-light mdi mdi-youtube-play" href="#"></a></li>
                          <li><a class="icon icon-md link-light mdi mdi-instagram" href="#"></a></li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li class="rd-sidebar__list-item">
                    <div class="rd-sidebar__list-item-inner">
                      <div class="icon rd-sidebar__list-item-icon linearicons-bubble-dots"></div>
                      <div class="rd-sidebar__list-item-main"><a class="rd-sidebar__list-item-link" href="#">Question Room</a></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="rd-navbar-nav-outer">
              <!-- RD Navbar Nav-->
              <ul class="rd-navbar-nav">
                <li class="rd-nav-item active"><a class="rd-nav-link" href="index.html">首頁</a>
                </li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#">交易平台</a>
                  <!-- RD Navbar Megamenu-->
                  <ul class="rd-menu rd-navbar-megamenu">
                    <li class="rd-megamenu-item">
                      <p class="rd-megamenu-title">交易平台</p>
                      <ul class="rd-megamenu-list">
                        <li class="rd-megamenu-list-item"><a class="rd-megamenu-list-link" href="#">TT2交易平台</a></li>
                        <li class="rd-megamenu-list-item"><a class="rd-megamenu-list-link" href="#">B交易平台</a></li>
                        <li class="rd-megamenu-list-item"><a class="rd-megamenu-list-link" href="#">D交易平台</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <!-- <div class="btc-to-usd">
              <p class="btc-to-usd__title">BTC\USD</p>
              <div class="btc-price">
                <div class="btcwdgt-price" data-bw-theme="light"></div>
              </div>
            </div> -->
          </div>
        </nav>
      </div>
    </header>

    <!-- Slider-->
    <section class="section bg-gray-800" style="overflow: hidden; position: relative;">
      <canvas id="globe"></canvas>
      <div class="slick-group-slider slick-transparent-header bg-gray-700">
        <div class="carousel-parent-outer carousel-parent-outer--bg-mod" data-parallax-scroll="{&quot;y&quot;: 90, &quot;from-scroll&quot;: 20, &quot;smoothness&quot;: 30}">
          <svg class="carousel-parent-shape" width="1216px" height="625px" viewBox="0 0 1216 625" preserveAspectRatio="none">
            <path fill-rule="evenodd" d="M-0.000,311.382 C-0.000,311.382 62.999,372.037 102.727,273.078 C118.498,233.793 168.280,306.657 186.342,249.138 C203.245,195.310 231.848,195.447 246.067,143.801 C266.856,68.285 291.661,3.867 310.569,0.159 C341.089,-5.826 374.891,182.287 422.852,134.224 C468.160,88.821 511.245,170.842 535.135,177.317 C545.468,180.117 579.312,194.321 613.972,189.287 C635.941,186.097 655.397,155.251 678.475,172.529 C726.537,208.512 730.880,342.989 781.202,397.567 C807.168,425.730 831.757,373.189 862.428,356.869 C890.078,342.156 923.937,365.255 946.043,356.869 C975.409,345.727 998.875,341.716 1015.324,294.624 C1027.442,259.931 1032.880,184.101 1048.770,155.771 C1068.789,120.077 1110.838,156.070 1129.996,129.436 C1169.461,74.571 1216.000,43.251 1216.000,43.251 L1216.000,624.999 L-0.000,624.999 L-0.000,311.382 Z"></path>
          </svg>
          <div class="slick-slider carousel-parent" data-arrows="true" data-loop="true" data-dots="true" data-swipe="true" data-items="1" data-fade="true" data-autoplay="true">
            <div>
              <div class="slick-slide-caption">
                <h6>Your #1 bitcoin resource</h6>
                <h1>Crypto Currency </h1>
                <h3 class="decoration-heading-1">That Changed the World</h3>
                <p>Bitcoin and other cryptocurrencies have completely changed the financial world. We are here to help you find out how it works.</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="about-us.html">Read More</a></div>
              </div>
            </div>
            <div>
              <div class="slick-slide-caption">
                <h6>Leading bitcoin exchange</h6>
                <h1>Easy exchange</h1>
                <h3 class="decoration-heading-1">For Everyone Worldwide</h3>
                <p>Our website has been a leading cryptocurrency exchange since day one of Bitcoin distribution. The whole process is easy and secure.</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="about-us.html">Read More</a></div>
              </div>
            </div>
            <div>
              <div class="slick-slide-caption">
                <h6>A perfect payment tool</h6>
                <h1>Pay everywhere</h1>
                <h3 class="decoration-heading-1">For Goods and Services</h3>
                <p>Like any other modern currency, Bitcoin is available everywhere at any time for transactions and payments.</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="about-us.html">Read More</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="crypto-currency-wrap"></section>
    <!-- Welcome-->
    <section class="section bg-white section-sm">
      <div class="container">
        <div class="row justify-content-center justify-content-lg-between align-items-center">
          <div class="col-md-8 col-lg-5">
            <h6>Technical standards</h6>
            <h2><strong>技術規格</strong></h2>
            <p>網頁版支持的系統，並且完美兼容各種移動設備</p>
            <div class="group group-1"><a class="box-lite" href="#">
                <div class="icon box-lite__icon mdi mdi-android"></div>
                <p class="box-lite__title">Android</p></a><a class="box-lite" href="#">
                <div class="icon box-lite__icon mdi mdi-apple"></div>
                <p class="box-lite__title ">IOS</p></a><a class="box-lite" href="#">
                <div class="icon box-lite__icon mdi mdi-windows"></div>
                <p class="box-lite__title">Windows</p></a><a class="box-lite" href="#">
                <div class="icon box-lite__icon mdi mdi-linux"></div>
                <p class="box-lite__title">Linux</p></a></div>
          </div>
          <div class="col-md-4 col-xl-7">
            <div class="image-group-2"><img src="index/images/index-1-555.png" alt="" width="758" height="555" data-parallax-scroll="{&quot;y&quot;: 20,  &quot;smoothness&quot;: 30 }"/><img src="index/images/index-phone-2.png" alt="" width="323" height="652" data-parallax-scroll="{&quot;y&quot;: 300,  &quot;smoothness&quot;: 30}"/>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-md bg-gray-700 text-center context-dark section-overlay-1">
      <div class="container">
        <h6>Technical standards</h6>
        <h2><span class="d-inline-block" style="max-width: 520px;">技術規格</span></h2>
        <div class="row row-40 offset-top-1">
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon box-lily__icon mdi mdi-windows"></div>
              <p class="box-lily__title">Windows</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon box-lily__icon mdi mdi-linux"></div>
              <p class="box-lily__title">Linux</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon box-lily__icon mdi mdi-apple"></div>
              <p class="box-lily__title">IOS</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon box-lily__icon mdi mdi-android"></div>
              <p class="box-lily__title">Android</p></a></div>
        </div>
      </div>
    </section>

    <!-- What bitcoin offers you-->
    <section class="section section-xl bg-white text-center">
      <div class="container">
        <h6>What bitcoin offers you</h6>
        <h2>No idea <strong>what’s</strong>  going on?</h2>
        <p><span style="max-width: 430px;">Bitcoin is received, stored, and sent using software known as Bitcoin Wallet, which is available for free.</span></p>
        <div class="row row-30">
          <div class="col-lg-7">
            <div class="image-group-3"><img src="index/images/index-ipad-812x673.png" alt="" width="812" height="673" data-parallax-scroll="{&quot;y&quot;: 80,  &quot;smoothness&quot;: 30 }"/>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="row row-30">
              <div class="col-12"></div>
              <div class="col-12 wow fadeInUpSmall">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon linearicons-mouse-right"></span>
                  <div class="link-box__main">
                    <h4>Download a Wallet</h4>
                    <p>Easily gain access to your own wallet in a few clicks.</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".1s">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon linearicons-cart-exchange"></span>
                  <div class="link-box__main">
                    <h4>Use Bitcoin</h4>
                    <p>You can use your Bitcoins for all kinds of transactions.</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".15s">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon linearicons-bag-dollar"></span>
                  <div class="link-box__main">
                    <h4>Time to Buy Bitcoins</h4>
                    <p>Every registered user can buy or exchange bitcoins.</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".2s">
                <!-- Link Box --><a class="link-box" href="#"><span class="icon link-box__icon linearicons-folder-search"></span>
                  <div class="link-box__main">
                    <h4>Knowledge Base</h4>
                    <p>Find an answer to any Bitcoin-related question.</p>
                  </div></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works-->
    <section class="section section-lg bg-gray-100 text-center">
      <div class="container container-md-smaller">
        <div class="row justify-content-center">
          <div class="col-sm-10 col-md-12">
            <h6 class="wow fadeInUpSmall">How it works</h6>
            <h2 class="wow fadeInUpSmall" data-wow-delay=".1s"><span class="d-inline-block" style="max-width: 570px;">以您的方式在市場交易</span></h2>
          </div>
        </div>
        <ul class="list-steps">
          <li class="list-steps__item wow fadeInLeftSmall" data-wow-delay=".1s">
            <div class="list-steps__item-counter"></div>
            <div class="list-steps__item-divider"></div>
            <div class="list-steps__item-main">
              <h4><a href="#">全部在瞬間完成</a></h4>
              <p>使用即時買入和賣出按鈕直接從實時圖表中開設倉位</p>
            </div>
          </li>
          <li class="list-steps__item wow fadeInLeftSmall" data-wow-delay=".2s">
            <div class="list-steps__item-counter"></div>
            <div class="list-steps__item-divider"></div>
            <div class="list-steps__item-main">
              <h4><a href="#">無需在查找</a></h4>
              <p>使用個性化觀察列表將您交易最多的產品放於一處</p>
            </div>
          </li>
          <li class="list-steps__item wow fadeInLeftSmall" data-wow-delay=".3s">
            <div class="list-steps__item-counter"></div>
            <div class="list-steps__item-divider"></div>
            <div class="list-steps__item-main">
              <h4><a href="#">氣質與內涵</a></h4>
              <p>在深暗與明亮主題之間切換以自定義平台視圖</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- A few words about bitcoin-->
    <section class="section bg-default">
      <div class="range">
        <div class="cell-lg-6 height-fill">
          <div class="thumbnail-video context-dark"><img class="thumbnail-video__image" src="index/images/video-preview-1-961x598.jpg" alt="" width="961" height="598"/><a class="button-video" href="//www.youtube.com/embed/QZzbm-FrkGk" data-lightgallery="item" data-lg-fullscreen="false"></a>
          </div>
        </div>
        <div class="cell-lg-6 align-self-center">
          <div class="cell-inner">
            <div class="box-inset-1">
              <h6 class="wow fadeInRightSmall">A few words about bitcoin</h6>
              <h2 class="wow fadeInRightSmall" data-wow-delay=".1s"><strong>Bitcoin</strong> is different than any currency </h2>
              <!-- Bootstrap tabs-->
              <div class="tabs-custom tabs-horizontal tabs-line wow fadeInRightSmall" id="tabs-about" data-wow-delay=".2s">
                <!-- Nav tabs-->
                <ul class="nav nav-tabs">
                  <li class="nav-item" role="presentation"><a class="nav-link active" href="#tabs-about-1" data-toggle="tab">About</a></li>
                  <li class="nav-item" role="presentation"><a class="nav-link" href="#tabs-about-2" data-toggle="tab">How it works</a></li>
                  <li class="nav-item" role="presentation"><a class="nav-link" href="#tabs-about-3" data-toggle="tab">Mission</a></li>
                </ul>
                <!-- Tab panes-->
                <div class="tab-content">
                  <div class="tab-pane fade show active" id="tabs-about-1">
                    <p>Bitcoin differs from any currency you’ve used before, so it's important to understand some key points including the fact that this currency is not anonymous and can’t be regulated.</p>
                  </div>
                  <div class="tab-pane fade" id="tabs-about-2">
                    <p>Bitcoin is based on a protocol known as the blockchain, which allows to create, transfer and verify ultra-secure financial data without interference of third parties.</p>
                  </div>
                  <div class="tab-pane fade" id="tabs-about-3">
                    <p>Our mission as an official partner of Bitcoin Foundation is to help you enter and better understand the world of #1 cryptocurrency and avoid any issues you may encounter.</p>
                  </div>
                </div>
              </div><a class="button button-default-outline wow fadeIn" data-wow-delay=".3s" href="about-us.html">Read more</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Be one step ahead-->
    <section class="section bg-gray-700 particles-js-outer section-overlay-2">
      <div id="particles-js"></div>
      <div class="container">
        <div class="row justify-content-center justify-content-xl-between align-items-end">
          <div class="col-md-10 col-lg-6">
            <div class="section-lg">
              <h6 class="wow fadeInLeftSmall">Be one step ahead</h6>
              <h2 class="wow fadeInLeftSmall" data-wow-delay=".1s">Learning <strong>80%</strong> of what the experts know is easy</h2>
              <p class="lead wow fadeInLeftSmall" data-wow-delay=".15s">Join our FREE 10-day email course and start today.</p>
              <!-- RD Mailform-->
              <form class="form form-lg rd-mailform form-inline wow fadeInLeftSmall" data-wow-delay=".2s" data-form-output="form-output-global" data-form-type="subscribe" method="post" action="bat/rd-mailform.php">
                <div class="form-wrap">
                  <input class="form-input" id="subscribe-form-email" type="email" name="email" data-constraints="@Email @Required">
                  <label class="form-label" for="subscribe-form-email">Enter your e-mail</label>
                </div>
                <div class="form-button">
                  <button class="button button-primary" type="submit">Send</button>
                </div>
              </form>
              <p class="wow fadeInLeftSmall" data-wow-delay=".25s"><span style="opacity: .25;">*We promise not to send spam</span></p>
            </div>
          </div>
          <div class="col-md-10 col-lg-6 col-xl-5">
            <div class="bitcoin-widget bitcoin-widget_windowed bitcoin-widget_windowed-1"><img class="bitcoin-widget__top-panel" src="index/images/decoration-browser-panel-564x36.png" alt="" width="564" height="36"/>
              <div class="btcwdgt-chart" data-bw-theme="dark"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features-->
    <section class="section bg-white">
      <div class="container">
        <div class="row row-bordered-1">
          <div class="col-sm-6 col-lg-4 wow fadeIn">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-lock"></span>
                    <h4 class="box-minimal__title">Safe &amp; Secure</h4>
                    <div class="box-minimal__divider"></div>
                    <p>Be sure in your account security and your funds safety.</p>
                  </article>
          </div>
          <div class="col-sm-6 col-lg-4 wow fadeIn" data-wow-delay=".1s">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-cloud-upload"></span>
                    <h4 class="box-minimal__title">Instant Exchange</h4>
                    <div class="box-minimal__divider"></div>
                    <p>Exchange your bitcoins instantly without any extra payments.</p>
                  </article>
          </div>
          <div class="col-sm-6 col-lg-4 wow fadeIn" data-wow-delay=".2s">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-umbrella2"></span>
                    <h4 class="box-minimal__title">Expert Support</h4>
                    <div class="box-minimal__divider"></div>
                    <p>We provide 24/7 expert support for our registered clients.</p>
                  </article>
          </div>
          <div class="col-sm-6 col-lg-4 wow fadeIn">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-tablet2"></span>
                    <h4 class="box-minimal__title">Mobile Apps</h4>
                    <div class="box-minimal__divider"></div>
                    <p>Perfectly developed mobile apps will open you new opportunities.</p>
                  </article>
          </div>
          <div class="col-sm-6 col-lg-4 wow fadeIn" data-wow-delay=".1s">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-credit-card"></span>
                    <h4 class="box-minimal__title">Personal Wallet</h4>
                    <div class="box-minimal__divider"></div>
                    <p>Our easy-to-use personal wallet system will keep your bitcoins safe.</p>
                  </article>
          </div>
          <div class="col-sm-6 col-lg-4 wow fadeIn" data-wow-delay=".2s">
                  <!-- Box Minimal-->
                  <article class="box-minimal"><span class="icon box-minimal__icon linearicons-sync"></span>
                    <h4 class="box-minimal__title">Recurring Buys</h4>
                    <div class="box-minimal__divider"></div>
                    <p>Bitcoin allows you to set up recurring transactions in just two clicks.</p>
                  </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA-->
    <section class="section parallax-container section-md bg-gray-700 text-center section-overlay-1 text-lg-left" data-parallax-img="index/images/home-parallax-1.jpg">
      <div class="parallax-content">
        <div class="container">
          <div class="row row-30 align-items-center">
            <div class="col-lg-9 wow fadeInLeftSmall">
              <h2>Get fully <strong>featured</strong>, convenient wallet</h2>
              <p class="big">Bitcoin wallet is a perfect solution for your cryptocurrency storage needs.</p>
            </div>
            <div class="col-lg-3 wow fadeInRightSmall text-lg-right">
              <button class="button button-default-outline" data-toggle="modal" data-target="#modal-login-register">Register now</button>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Feedback-->
    <section class="section bg-gray-100 slider-group_testimonials">
      <div class="slick-slider carousel-child wow fadeIn" id="child-carousel" data-for=".carousel-parent" data-arrows="false" data-loop="true" data-dots="false" data-swipe="false" data-fade="true" data-swiper="true" data-items="1">
        <div class="item"><img src="index/images/home-testimonials-1-744x623.png" alt="" width="744" height="623"/>
        </div>
        <div class="item"><img src="index/images/home-testimonials-2-744x623.png" alt="" width="744" height="623"/>
        </div>
        <div class="item"><img src="index/images/home-testimonials-3-744x623.png" alt="" width="744" height="623"/>
        </div>
      </div>
      <div class="container">
        <div class="row justify-content-end">
          <div class="col-md-8 col-lg-7">
            <h2><strong>金融家</strong> 網頁版交易</h2>
            <div class="slick-slider carousel-parent" data-arrows="false" data-loop="false" data-dots="true" data-swipe="false" data-items="1" data-fade="true" data-child="#child-carousel" data-for="#child-carousel">
              <div class="item">
                <blockquote class="quote-classic">
                  <div class="quote-classic__meta">
                    <cite class="quote-classic__cite">通過您的網路流覽器開始金融市場的交易</cite>
                  </div>
                  <div class="quote-classic__text">
                    <p>金融家 可以使您從任何流覽器和任何作業系統，包括Windows，Mac和Linux，開始進行外匯，股票，期貨市場的交易。您可以在網站直接訪問MetaTrader 5桌面平臺提供的豐富功能，這意味著您可以分析報價和交易，而無需下載或安裝任何應用程式。簡單地敲擊幾次，您就可以訪問您的帳戶並開始交易。網路平臺的交易非常安全，傳播的任何資訊都是被安全加密的。</p>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="text-extra-large">Financier</p>
    </section>

    <!-- News-->
    <section class="section parallax-container section-md bg-gray-700 section-overlay-2 text-center text-lg-left" data-parallax-img="index/images/home-parallax-2.jpg">
      <div class="parallax-content">
        <div class="container">
          <div class="row row-30 flex-lg-row-reverse justify-content-center align-items-center">
            <div class="col-sm-10 col-lg-5">
              <div class="box-inset-2">
                <h6 class="wow fadeInRightSmall">In the spotlight</h6>
                <h2 class="wow fadeInRightSmall" data-wow-delay=".1s">Latest Bitcoin <strong>News</strong> Stories</h2>
                <p class="wow fadeInRightSmall" data-wow-delay=".2s">Read the latest Bitcoin-related news articles and stories and share your own ones!</p><a class="button button-primary wow fadeIn" data-wow-delay=".3s" href="news.html">Read all news</a>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="post-minimal-group">
                <!-- 1-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="4012">
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>PR: Uservice Is a Global Decentralized Blockchain Platform for the Auto Industry</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Major Exchanges Don’t Want Forked Coins but Smaller Platforms Can’t Get Enough of Them</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>American Programmer Arrested Over $20 Million Bitcoin Theft</p>
                  </article>
                </div>
                <!-- 2-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="5017">
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>A Hacker Gained Access to the Bitcoin Gold Windows Wallet Github</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Markets Update: Bitcoin Price Moves Sideways During the Holidays</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Vietnam Investigates Merchants for Accepting Bitcoin Despite Warnings</p>
                  </article>
                </div>
                <!-- 3-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="6035">
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Hong Kong Company Set to Build Crypto Mining Farm and Museum</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Bitcoin Network Fees Are Irritating Cryptocurrency Proponents</p>
                  </article>
                  <article class="post-minimal">
                    <time class="post-minimal__time" datetime="2018">Nov 20, 2018</time>
                    <p>Data Over Drama: Bitcoin Cash Versus Bitcoin Core Transactions</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Page Footer-->
    <footer class="section footer-classic context-dark">
      <div class="container">
        <div class="footer-classic__main">
          <div class="row row-50">
            <div class="col-lg-6">
              <div class="unit unit-spacing-sm flex-column flex-sm-row align-items-sm-center">
                <div class="unit-left"><a class="brand" href="index.html"><img class="brand-logo-dark" src="index/images/logo-default-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-default-210x76.png 2x"/><img class="brand-logo-light" src="index/images/logo-inverse-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-inverse-210x76.png 2x"/></a>
                </div>
                <div class="unit-body">
                  <p><span style="max-width: 380px;">NODO Crypt is the leading exchange of #1 cryptocurrency offering you the best conversion rates.</span></p>
                </div>
              </div>
              <div class="group group-lg group-middle">
                <p class="large">Connect with Community</p>
                <div class="group-item">
                  <ul class="list-inline list-inline-sm">
                    <li><a class="icon icon-lg link-default mdi mdi-facebook" href="#"></a></li>
                    <li><a class="icon icon-lg link-default mdi mdi-twitter" href="#"></a></li>
                    <li><a class="icon icon-lg link-default mdi mdi-youtube-play" href="#"></a></li>
                    <li><a class="icon icon-lg link-default mdi mdi-instagram" href="#"></a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="box-inset-3">
                <h4>Sign Up for Our Newsletter</h4>
                <!-- RD Mailform-->
                <form class="form form-lg form_light rd-mailform form-inline" data-form-output="form-output-global" data-form-type="subscribe" method="post" action="bat/rd-mailform.php">
                  <div class="form-wrap">
                    <input class="form-input" id="footer-subscribe-form-email" type="email" name="email" data-constraints="@Email @Required">
                    <label class="form-label" for="footer-subscribe-form-email">Enter your e-mail</label>
                  </div>
                  <div class="form-button">
                    <button class="button button-color-2" type="submit">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="footer-classic__aside">
          <div class="list-wrap">
            <ul class="list-nav">
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="about-us.html">About</a></li>
              <li><a href="news.html">News</a></li>
              <li>
                <button data-toggle="modal" data-target="#modal-login-register">Sign In</button>
              </li>
              <li><a href="#">Documentation</a></li>
              <li><a href="contacts.html">Contacts</a></li>
            </ul>
          </div>
          <div class="list-wrap">
            <ul class="list-bordered">
              <li>
                <!-- Rights-->
                <p class="rights"><span>&copy;&nbsp;</span><span class="copyright-year"></span><span>&nbsp;</span><span>NODO Crypt</span><span>.&nbsp;</span><a href="privacy-policy.html">Privacy Policy</a></p>
              </li>
              <li><a href="/cdn-cgi/l/email-protection#381b"><span class="__cf_email__" data-cfemail="d2bbbcb4bd92b6b7bfbdbebbbcb9fcbda0b5">[email&#160;protected]</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>

  </div>
  <!-- Modal Login/Register-->
  <div class="modal modal-login-register fade" id="modal-login-register" tabindex="-1" role="dialog" aria-labelledby="modal-login-register-label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="font-weight-bold modal-title" id="modal-login-register-label">Login Form</h2>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div class="group-sm group-sm-justify"><a class="button button-sm button-facebook button-icon button-icon-left" href="#"><span class="icon fa fa-facebook"></span>Facebook</a><a class="button button-sm button-twitter button-icon button-icon-left" href="#"><span class="icon fa fa-twitter"></span>Twitter</a><a class="button button-sm button-google button-icon button-icon-left" href="#"><span class="icon fa fa-google-plus"></span>Google+</a></div>
          <p class="text-uppercase">or</p>
          <!-- RD Mailform-->
          <form class="form rd-mailform form-centered">
            <div class="form-wrap">
              <input class="form-input" id="popup-form-login-email" type="email" name="email" data-constraints="@Email @Required">
              <label class="form-label" for="popup-form-login-email">E-mail</label>
            </div>
            <div class="form-wrap">
              <input class="form-input" id="popup-form-login-password" type="password" name="password" data-constraints="@Required">
              <label class="form-label" for="popup-form-login-password">Password</label>
            </div>
            <div class="form-wrap">
              <label class="checkbox-inline">
                <input name="checkbox" value="checkbox-1" type="checkbox" checked>Remember me 
              </label>
            </div>
            <div class="group">
              <button class="button button-primary" type="submit">Login</button>
              <button class="button button-default-outline">Create an Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- Global Mailform Output-->
  <div class="snackbars" id="form-output-global"></div>
</div>
</template>

<script>
import '@/assets/index/style.scss'
import axios from 'axios'
import qs from 'qs'

export default {
	head() {
	  return {
	  	htmlAttrs: {
	  	   class: 'wide wow-animation'
	  	},
	    script: [
	      { src: 'index/js/core.min.js' },
	      { src: 'index/js/script.js', body: true },
	    ],
	    link: [
	      { rel: 'stylesheet', href: 'index/css/fonts.css' },
	      { rel: 'stylesheet', href: 'index/css/bootstrap.css' },
	      { rel: 'stylesheet', href: 'index/css/style.css' },
	    ]
	  }
	},
	data () {
	  return {
			loading: true,
			loginShow: false,
			account: '',
			password: '',
			rememberMe: '',
			server: 'server1',
	  }
	},
	beforeMount() {
		this.checkDevice()
	},
	mounted() {
		this.loading = false

		//remember data
		const remember = this.$store.state.localStorage.remember
		this.rememberMe = remember.me

		if (this.rememberMe) {
			this.account = remember.account
			this.password = remember.password
		}

		setTimeout(function(){
			document.getElementById("__nuxt").style = 'display: block'
		}, 200)
	},
	methods: {
		async doLogin() {
			let _this = this

			if (this.account == '' || this.password == '') {
				this.$alert('帳號或密碼不得為空', '注意!')
				return
			}

			this.loading = true

			await axios.post(process.env.NUXT_ENV_API_URL + "/validation", qs.stringify({
			  LoginAccount: this.account,
			  LoginPassword: this.password,
			  LoginMobile: 0,
			}))
			.then(response => {
				const result = response.data

			  if (result['Code'] <= 0) {
			  	this.$alert(result['ErrorMsg'], '注意!')
			  	_this.loading = false
			  	return
			  }

			  if (result["Code"] == 2) {
				sessionStorage.setItem("UserAccount", result["UserAccount"]);
				sessionStorage.setItem("UserID", result["UserId"]);
				sessionStorage.setItem("ChooseID", result["ChooseId"]);
				sessionStorage.setItem("UserToken", result["Token"]);
				window.location.href = "/agent/index.php"
				return
			  }

			  //記住我
			  _this.$store.commit('setRemember', {
			  	me: _this.rememberMe,
			  	account: _this.account,
			  	password: _this.password,
			  })

			  //set user info
			  _this.$store.commit('setuserAuth', result)
			})
		}
	},
}
</script>