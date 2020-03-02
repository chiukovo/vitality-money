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
              <div class="rd-navbar-brand"><a class="brand" href="#"><img class="brand-logo-dark" src="/index/images/logo-default-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-default-210x76.png 2x"/><img class="brand-logo-light" src="/index/images/logo-inverse-125x45.png" alt="" width="125" height="45" srcset="index/images/logo-inverse-210x76.png 2x"/></a>
              </div>
            </div>
            <div class="rd-navbar-nav-outer">
              <!-- RD Navbar Nav-->
              <ul class="rd-navbar-nav">
                <li class="rd-nav-item active"><a class="rd-nav-link" href="#" onclick="return false;">首頁</a>
                </li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#">交易平台</a>
                  <!-- RD Navbar Dropdown-->
                  <ul class="rd-menu rd-navbar-dropdown">
                    <li class="rd-megamenu-item">
                      <p class="rd-megamenu-title">交易平台</p>
                      <ul class="rd-megamenu-list">
                        <li class="rd-megamenu-list-item"><a class="rd-megamenu-list-link" :href="horse_url">B交易平台</a></li>
                        <li class="rd-megamenu-list-item"><a class="rd-megamenu-list-link" :href="dt_url">D交易平台</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#" onclick="return false;">關於我們</a></li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#" onclick="return false;">多國語言</a></li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#" onclick="return false;">意見調查</a></li>
                <li class="rd-nav-item"><a class="rd-nav-link" href="#" data-toggle="modal" data-target="#modal">註冊</a></li>
                <li class="rd-nav-item">
                  <button class="button button-primary" data-toggle="modal" data-target="#modal">登入</button>
                </li>
              </ul>
            </div>
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
                <h6>創新，安全，專業</h6>
                <h1>讓獲利更簡單</h1>
                <h3 class="decoration-heading-1">已有數百萬人使用 金融家系統。</h3>
                <p>進行世界最受歡迎的市場交易，探索無限交易選擇。我們提供數千種金融工具、免費即時行情和全天候線上支持。</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="#" data-toggle="modal" data-target="#modal">立即登入</a></div>
              </div>
            </div>
            <div>
              <div class="slick-slide-caption">
                <h6>通過我們強大的平台進入市場</h6>
                <h1>專業數據分析</h1>
                <h3 class="decoration-heading-1">交易及投資頂尖金融工具</h3>
                <p>享受幾近即時的市場訂單執行流程，進行世界最受歡迎的市場交易。在簡單直覺的交易平台上投資各種市場。</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="#" data-toggle="modal" data-target="#modal">立即登入</a></div>
              </div>
            </div>
            <div>
              <div class="slick-slide-caption">
                <h6>拒絕被淘汰</h6>
                <h1>全新H5 智能分析</h1>
                <h3 class="decoration-heading-1">簡單操作 適合所有族群</h3>
                <p>每次最小交易手數低至0.01手，低保證金即可開倉。交易非常有競爭力、透明的低價差，低隔夜利息，讓您盡享低成本的交易</p>
                <div class="slick-slide-caption__footer"><a class="button button-primary" href="#" data-toggle="modal" data-target="#modal">立即登入</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="crypto-currency-wrap"></section>

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
    <!-- Welcome-->
    <section class="section bg-white section-xl">
      <div class="container">
        <div class="row justify-content-center justify-content-lg-between align-items-center">
          <div class="col-md-8 col-lg-5">
            <h6>html5 Technology</h6>
            <h2><strong>HTML5</strong></h2>
            <p>HTML5作爲一種被多個操作系統共同使用的標準，已經成爲跨平臺開發應用程序的首選。最大的特點就是手機移動平臺和電腦平臺都可以暢通無阻的玩遊戲，所以你不用裝任何APP軟體，只需要輸入網址就可以盡情享受。</p>
            <p>支援各種電腦系統，並且完美兼容各種移動設備。</p>
          </div>
          <div class="col-md-4 col-xl-7">
            <div class="image-group-2">
              <img src="/index/images/MacBook.png" alt="" width="605" height="348" data-parallax-scroll="{&quot;y&quot;: 60,  &quot;smoothness&quot;: 30 }"/>
              <img src="/index/images/iPhone 5S.png" alt="" width="180" height="382" data-parallax-scroll="{&quot;y&quot;: 40,  &quot;smoothness&quot;: 30}"/>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-md bg-gray-700 text-center context-dark section-overlay-1">
      <div class="container">
        <h6>Technical standards</h6>
        <h2><span class="d-inline-block" style="max-width: 520px;">技術規格</span></h2>
        <p>網頁版/支持的瀏覽器</p>
        <div class="row row-40 offset-top-1">
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon browser-logo">
                <img src="/index/images/browser_logo_chrome.png">
              </div>
              <p class="box-lily__title">Google Chrome</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon browser-logo">
                <img src="/index/images/browser_logo_firefox.png">
              </div>
              <p class="box-lily__title">Mozilla Firefox</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon browser-logo">
                <img src="/index/images/browser_logo_edge.png">
              </div>
              <p class="box-lily__title">Microsoft Edge</p></a></div>
          <div class="col-6 col-md-3"><a class="box-lily" href="#">
              <div class="icon browser-logo">
                <img src="/index/images/browser_logo_safari.png">
              </div>
              <p class="box-lily__title">Safari</p></a></div>
        </div>
      </div>
    </section>

    <!-- What bitcoin offers you-->
    <section class="section section-xl bg-white text-center">
      <div class="container">
        <h6>Trading platform</h6>
        <h2>交易平台</h2>
        <!-- <span><span style="max-width: 430px;">Bitcoin is received, stored, and sent using software known as Bitcoin Wallet, which is available for free.</span></p> -->
        <div class="row row-30">
          <div class="col-lg-7">
            <div class="image-group-3"><img src="/index/images/index-ipad.png" alt="" width="812" height="592" data-parallax-scroll="{&quot;y&quot;: 80,  &quot;smoothness&quot;: 30 }"/>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="row row-30">
              <div class="col-12"></div>
              <div class="col-12 wow fadeInUpSmall">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon linearicons-mouse-right"></span>
                  <div class="link-box__main">
                    <h4>簡易操作</h4>
                    <p>適合所有及別的交易者。從初學這到經驗者在到專業人士。</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".1s">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon  linearicons-signal"></span>
                  <div class="link-box__main">
                    <h4>多功能</h4>
                    <p>三種不同的技術圖表，十七種的技術指標跟定制趨勢線。</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".15s">
                <!-- Link Box--><a class="link-box" href="#"><span class="icon link-box__icon linearicons-cash-dollar"></span>
                  <div class="link-box__main">
                    <h4>多種交易模式</h4>
                    <p>兩種不同的交易模式，經典高底(HIGHLOW Options)還是任意時間(Anytime Options)，一切取決於您的偏好。</p>
                  </div></a>
              </div>
              <div class="col-12 wow fadeInUpSmall" data-wow-delay=".2s">
                <!-- Link Box --><a class="link-box" href="#"><span class="icon link-box__icon linearicons-laptop-phone"></span>
                  <div class="link-box__main">
                    <h4>適用於所有設備</h4>
                    <p>交易平台建立在瀏覽器上，適用所有設備。</p>
                  </div></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features-->
    <section class="section bg-gray-100 section-xl text-center">
      <div class="container">
        <h6>Advantage</h6>
        <h2>金融家 網頁版交易的優勢</h2>
        <p>網頁版交易的所有優勢現在都能提供給您。現在就打開您的網路流覽器開始交易！</p>
        <div class="row row-bordered-1">
          <div class="col-sm-4 col-lg-3 wow fadeIn">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-desktop"></span>
              <!-- <h4 class="box-minimal__title">Safe &amp; Secure</h4> -->
              <div class="box-minimal__divider"></div>
              <p>通過任何網路流覽器進行外匯，股票，期貨和的交易</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".1s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-new-tab"></span>
              <!-- <h4 class="box-minimal__title">Instant Exchange</h4> -->
              <div class="box-minimal__divider"></div>
              <p>網頁平臺的操作無需任何額外的軟體或流覽器擴展</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-network"></span>
              <!-- <h4 class="box-minimal__title">Expert Support</h4> -->
              <div class="box-minimal__divider"></div>
              <p>相容Windows，Mac，Linux</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-laptop-phone"></span>
              <!-- <h4 class="box-minimal__title">Recurring Buys</h4> -->
              <div class="box-minimal__divider"></div>
              <p>支援各種行動裝置</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-shirt"></span>
              <!-- <h4 class="box-minimal__title">Recurring Buys</h4> -->
              <div class="box-minimal__divider"></div>
              <p>各種不同的佈景主題</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-shield-check"></span>
              <!-- <h4 class="box-minimal__title">Mobile Apps</h4> -->
              <div class="box-minimal__divider"></div>
              <p>可靠的資料保護</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".1s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-lock"></span>
              <!-- <h4 class="box-minimal__title">Personal Wallet</h4> -->
              <div class="box-minimal__divider"></div>
              <p>單邊持倉和鎖倉持倉帳戶系統</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-files"></span>
              <!-- <h4 class="box-minimal__title">Recurring Buys</h4> -->
              <div class="box-minimal__divider"></div>
              <p>全部的交易訂單，包括掛單和止損訂單</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-finger-tap2"></span>
              <!-- <h4 class="box-minimal__title">Mobile Apps</h4> -->
              <div class="box-minimal__divider"></div>
              <p>先進的市場深度和一鍵交易</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".1s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-graph"></span>
              <!-- <h4 class="box-minimal__title">Personal Wallet</h4> -->
              <div class="box-minimal__divider"></div>
              <p>3種圖表類型和9種時間週期</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-chart-settings"></span>
              <!-- <h4 class="box-minimal__title">Recurring Buys</h4> -->
              <div class="box-minimal__divider"></div>
              <p>30種指標和24個圖形物件用於技術分析</p>
            </article>
          </div>
          <div class="col-sm-4 col-lg-3 wow fadeIn" data-wow-delay=".2s">
            <!-- Box Minimal-->
            <article class="box-minimal"><span class="icon box-minimal__icon linearicons-power"></span>
              <!-- <h4 class="box-minimal__title">Recurring Buys</h4> -->
              <div class="box-minimal__divider"></div>
              <p>即時獲得市場報價</p>
            </article>
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
              <h6 class="wow fadeInLeftSmall">join us</h6>
              <h2 class="wow fadeInLeftSmall" data-wow-delay=".1s">立即加入我們</h2>
              <!-- RD Mailform-->
              <div class="form form-lg rd-mailform form-inline wow fadeInLeftSmall">
                <!-- <div class="form-wrap">
                  <input class="form-input" id="subscribe-form-email" type="email" name="email" data-constraints="@Email @Required">
                  <label class="form-label" for="subscribe-form-email">Enter your e-mail</label>
                </div> -->
                <div class="form-button">
                  <button class="button button-primary" data-toggle="modal" data-target="#modal">註冊真實帳戶</button>
                </div>
                <div class="form-button">
                  <button class="button button-default-outline" data-toggle="modal" data-target="#modal">免費註冊模擬帳戶</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Feedback-->
    <section class="section bg-gray-100 slider-group_testimonials">
      <div class="slick-slider carousel-child wow fadeIn" id="child-carousel" data-for=".carousel-parent" data-arrows="false" data-loop="true" data-dots="false" data-swipe="false" data-fade="true" data-swiper="true" data-items="1">
        <div class="item"><img src="/index/images/home-testimonials-1-744x623.png" alt="" width="744" height="623"/>
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
                <h6 class="wow fadeInRightSmall">We can do for you</h6>
                <h2 class="wow fadeInRightSmall" data-wow-delay=".1s">值得信赖</h2>
                <p class="wow fadeInRightSmall" data-wow-delay=".2s">金融家 是網絡交易行業的領軍人。我們受到30,000,000客戶的信任。!</p>
                <!-- <a class="button button-primary wow fadeIn" data-wow-delay=".3s" href="#">立即加入</a> -->
              </div>
            </div>
            <div class="col-lg-7">
              <div class="post-minimal-group">
                <!-- 1-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="4012">
                  <article class="post-minimal">
                    <p>24在線客服解決您任何時間的所有問題</p>
                  </article>
                  <article class="post-minimal">
                    <p>科技讓投資更簡單</p>
                  </article>
                  <article class="post-minimal">
                    <p>支援超過100種支付方式</p>
                  </article>
                </div>
                <!-- 2-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="5017">
                  <article class="post-minimal">
                    <p>支援超過100種支付方式</p>
                  </article>
                  <article class="post-minimal">
                    <p>24在線客服解決您任何時間的所有問題</p>
                  </article>
                  <article class="post-minimal">
                    <p>科技讓投資更簡單</p>
                  </article>
                </div>
                <!-- 3-->
                <!-- Owl Carousel-->
                <div class="owl-carousel" data-items="1" data-dots="false" data-nav="false" data-loop="true" data-margin="10" data-autoplay="true" data-mouse-drag="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-autoplay-timeout="6035">
                  <article class="post-minimal">
                    <p>科技讓投資更簡單</p>
                  </article>
                  <article class="post-minimal">
                    <p>支援超過100種支付方式</p>
                  </article>
                  <article class="post-minimal">
                    <p>24在線客服解決您任何時間的所有問題</p>
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
        <div class="footer-classic__aside text-center">
          <div>
            <span>&copy;&nbsp;</span><span class="copyright-year"></span><span>&nbsp;</span><span>copyright</span><span>.&nbsp;</span><a href="#" onclick="return false;">金融家</a>
          </div>
        </div>
      </div>
    </footer>

  </div>
  <!-- Modal Login/Register-->
  <div class="modal modal-login-register fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modal-login-register-label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="font-weight-bold modal-title" id="modal-login-register-label">登入系統</h2>
          <button class="close" type="button" data-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div class="group-sm group-sm-justify"><a class="button button-sm button-facebook button-icon button-icon-left" href="#"><span class="icon fa fa-facebook"></span>Facebook</a><a class="button button-sm button-twitter button-icon button-icon-left" href="#"><span class="icon fa fa-twitter"></span>Twitter</a><a class="button button-sm button-google button-icon button-icon-left" href="#"><span class="icon fa fa-google-plus"></span>Google+</a></div>
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
	      { src: '/index/js/core.min.js' },
	      { src: '/index/js/script.js', body: true },
	    ],
	    link: [
	      { rel: 'stylesheet', href: '/index/css/fonts.css' },
	      { rel: 'stylesheet', href: '/index/css/bootstrap.css' },
	      { rel: 'stylesheet', href: '/index/css/style.css' },
	    ]
	  }
	},
	data () {
	  return {
			loading: true,
      dt_url: '',
      horse_url: '',
	  }
	},
	mounted() {
		this.loading = false

    this.dt_url = process.env.NUXT_ENV_DT_URL
    this.horse_url = process.env.NUXT_ENV_HORSE_URL

		setTimeout(function(){
			document.getElementById("__nuxt").style = 'display: block'
		}, 200)
	},
}
</script>