if(typeof(Storylane) != 'object'){
  var Storylane = {
    Play: function(params){
      if (typeof(params) != 'object'){
        console.log('Error: Invalid params.');
        return 0;
      }
      this.params = params;

      switch(this.params.type){
        case 'popup':
          this.Player(params);
          break;
        case 'preview_embed':
          this.PreviewEmbed(params);
          break;
        default:
          true;
      }
    },

    PreviewEmbed: function(params){
      if (typeof(params) != 'object'){
        console.log('Error: Invalid params.');
        return 0;
      }

      let defaultParams = {scale: 0.9};
      this.params = {...defaultParams, ...params};

      if (!this.params.hasOwnProperty('demo_url')){
        console.log('Error: Invalid params. Please provide valid demo_url');
        return 0;
      }

      console.log("creating storylane demo with preview");

      let link = this.params.element;
      let container = link.closest(".sl-embed-container");
      let preview = container.querySelector(".sl-preview");
      let iframe = container.querySelector("iframe.sl-demo");

      if (link.parentElement.classList.contains('sl-preview-heading')) {
        link.parentElement.style.display = 'none';
      } else {
        link.style.display = 'none';
      }

      preview.style.display = 'none';
      iframe.style.display = '';
      iframe.style.backgroundColor = "#f3f5f7";
      iframe.style.borderRadius = 'inherit';
      // iframe.style.background = preview.style.background;
      // iframe.style['background-size'] = preview.style['background-size'];
      iframe.src = this.params.demo_url;
    },

    Player: function(params){
      if (typeof(params) != 'object'){
        console.log('Error: Invalid params.');
        return 0;
      }

      let defaultParams = {scale: 0.9, width: '100%', padding_bottom: 'calc(56.33% + 27px)', fullscreen: false};
      this.params = {...defaultParams, ...params};

      if (!this.params.hasOwnProperty('demo_url')){
        console.log('Error: Invalid params. Please provide valid demo_url');
        return 0;
      }

      this.storylane_style = `
        #__sl-demo-wrapper{
          position: fixed;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          z-index: 9999999;
          background: rgba(0,0,0,0.8);
        }
        .__sl-embed-container1{
          z-index: 99999999;
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: auto;
          flex-direction: column;
          background: #000000;
          box-shadow: 0px 0px 5px #222222;
          padding-bottom: calc(56.33% + 27px);
        }
        .__sl-embed-container{
          z-index: 99999999;
          position: relative;
          width: 100%;
          display: flex;
          max-width: 100%;
          height: 100%;
          max-height: 100%;
          align-items: center;
          justify-content: center;
        }
        .__sl-close-btn{
          position: absolute !important;
          background: #ffffff !important;
          color: #1A1348 !important;
          top: 16px !important;
          right: 16px !important;
          border: 2px solid #FFFFFE !important;
          border-radius: 20px !important;
          line-height: 18px !important;
          box-shadow: 0px 0px 5px #444 !important;
          cursor: pointer !important;
          z-index: 999999999 !important;
          font-family:Helvetica !important;
          box-shadow: 0px 0px 5px #222222 !important;
          font-size: 14px !important;
          font-weight: bold !important;
          height: 24px !important;
          width: 24px !important;
          padding: 0px !important;
        }
        .__sl-embed{
          position:relative;
          width:100%;
          height:0;
        }
        .__sl-embed-portrait{
          padding-bottom: 0px !important;
          height: 100% !important;
        }
        .__sl-player-iframe{
          position:absolute;top:0;left:0;width:100%;height:100%;border:none;
        }
      `;

      this.embed_style = `
        padding-bottom: $padding_bottom;
        transform: scale($scale);
        -webkit-transform: scale($scale);
        -moz-transform: scale($scale);
        -o-transform: scale($scale);
      `;

      this.demo_html = `
        <button class="__sl-close-btn">&times;</button>
        <div class="__sl-embed-container">
          <div class="__sl-embed-wrapper" style="width: $embed_width; height: $embed_height;">
            <div class="__sl-embed">
              <iframe class='__sl-player-iframe' allowfullscreen></iframe>
            </div>
          </div>
        </div>
      `;

      console.log("creating storylane demo");

      let wrapper = document.getElementById('__sl-demo-wrapper');
      if (wrapper == null) {
        wrapper = document.createElement('div');
        wrapper.id = '__sl-demo-wrapper';
        wrapper.style = 'display: none;'
        document.body.appendChild(wrapper);

        let style = document.createElement('style');
        style.innerHTML = this.storylane_style;
        document.head.appendChild(style);
      }
      wrapper.innerHTML = this.demo_html;

      // let link = document.getElementById(this.params['dom_id']);
      let link = this.params.element;
      let close = document.getElementsByClassName('__sl-close-btn')[0];
      let iframe = document.getElementsByClassName('__sl-player-iframe')[0];
      let embed_wrapper = document.getElementsByClassName('__sl-embed-wrapper')[0];
      let embed = document.getElementsByClassName('__sl-embed')[0];
      let scale = parseFloat(this.params.scale);


      // wrapper style
      let is_portrait = window.innerWidth < window.innerHeight;
      let screen_height = window.innerHeight - 50;
      let screen_width = window.innerWidth - 50;

      if (is_portrait){
        screen_height = window.innerHeight;
        screen_width = window.innerWidth;
      }

      let wrapper_width = screen_width;
      let wrapper_height = 'auto';

      if (this.params.fullscreen === true){
        wrapper_width = "100%";
      } else {
        let height = parseFloat(this.params.height);
        let width = parseFloat(this.params.width);

        if (!isNaN(height) && height != 0 && !isNaN(width) && width != 0){
          let ratio = parseFloat((height / width).toFixed(2));
          wrapper_width = width;

          if (height > screen_height){
            wrapper_width = parseFloat((screen_height / ratio).toFixed(2));
          }

          if (wrapper_width > screen_width){
            wrapper_width = screen_width;
          }
        }

        // scaling of width
        if(!isNaN(scale)){
          wrapper_width = (wrapper_width * scale).toFixed(2);
        }

        wrapper_width = wrapper_width + "px";
      }

      if (is_portrait){
        wrapper_width = "100%";
        if (this.params.demo_type === 'html'){
          wrapper_height = "100%";
          embed.classList.add('__sl-embed-portrait');
        }
      }

      let wrapper_style = embed_wrapper.getAttribute('style');
      wrapper_style = wrapper_style.replaceAll(/\$embed_width/g, wrapper_width);
      wrapper_style = wrapper_style.replaceAll(/\$embed_height/g, wrapper_height);
      embed_wrapper.setAttribute("style", wrapper_style);

      // embed style
      // let embed_style = this.embed_style.replaceAll(/\$scale/g, (isNaN(scale) ? 0.9 : scale));
      let embed_style = this.embed_style.replaceAll(/\$scale/g, 1.0);
      let padding = this.params.padding_bottom;
      embed_style = embed_style.replaceAll(/\$padding_bottom/g, padding);
      embed.style = embed_style;

      if(link && link.onclick === null){
        link.addEventListener('click', event => {
          iframe.src = this.params.demo_url;
          wrapper.style.display = '';
        });
      } else {
          iframe.src = this.params.demo_url;
          wrapper.style.display = '';
      }

      close.addEventListener('click', event => {
        wrapper.style.display = 'none';
        iframe.src = '';
      });
    },

    Embed: function(params){
      if (typeof(params) != 'object'){
        console.log('Error: Invalid params.');
        return 0;
      }

      let defaultParams = {scale: 0.9};
      this.params = {...defaultParams, ...params};

      if (!this.params.hasOwnProperty('demo_url')){
        console.log('Error: Invalid params. Please provide valid demo_url');
        return 0;
      }

      this.storylane_style = `
        #__sl-demo-embed-wrapper{
          width: 100%;
          height: 100%;
          z-index: 10000;
          background: rgba(0,0,0,0.6);
          background-color: #F3F5F7;
          border: 0px solid black;
        }
        .__sl-iframe{border: 0px; width: 100%; height: 100%; min-height: 100vh;}

        .__sl-demo-preview{
          width:100%; height: 100%;
          transform:scale(1.0);
          background-color: #ffffff;
          z-index: 999999999;
        }

        .__sl-play{
          z-index: 10003;
          box-sizing: border-box;
        	display:block;
        	width:140px;
        	height:60px;
        	padding-top: 14px;
        	padding-left: 8px;
        	line-height: 20px;
        	border: 3px solid #fff;
        	border-radius: 5px;
        	color: #f5f5f5;
        	text-align:center;
        	text-decoration:none;
        	background-color: #e0007a;
        	font-size: 22px;
        	font-weight: normal;
        	transition: all 0.3s ease;
          position: relative;
          top: 45%;
          left: 45%;
          cursor: pointer;
        }

        .__sl-play:hover {
        	background-color: #c1066c;
        	box-shadow: 0px 0px 6px rgba(255,255,100,1);
        }
      `;


      let wrapper = document.getElementById('__sl-demo-embed-wrapper');
      if (wrapper == null) {
        wrapper = document.createElement('div');
        wrapper.id = '__sl-demo-embed-wrapper';
        wrapper.style = '';

        let style = document.createElement('style');
        style.innerHTML = this.storylane_style;
        document.head.appendChild(style);
      }

      // let main = document.getElementById(this.params['dom_id']);

      let main = this.params.element;

      let demo_url = this.params.demo_url;
      let demo_preview = this.params.demo_preview;

      if (demo_url){
        console.log("creating storylane embedded demo");
        let iframe = document.createElement('iframe');
        iframe.classList = '__sl-iframe'
        iframe.src = this.params.demo_url;
        wrapper.appendChild(iframe);
        iframe.src = this.params.demo_url;

        main.innerHTML = '';
        main.appendChild(wrapper);
      } else if (demo_preview) {
        console.log("creating storylane embedded demo with preview");
        let iframe = main.innerHTML;

        let preview = document.createElement('div');
        preview.classList = '__sl-demo-preview';
        preview.style = "background: linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('" + demo_preview + "') no-repeat; background-size: 100% auto;";

        let play = document.createElement('a');
        play.classList = '__sl-play';
        play.text = 'Start Demo';

        play.addEventListener('click', event => {
           preview.remove();
           wrapper.innerHTML = iframe;
        });

        preview.appendChild(play);
        wrapper.appendChild(preview);

        main.innerHTML = '';
        main.appendChild(wrapper);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    // analytics JS
    const sl_analytics = document.createElement('script');
    sl_analytics.src = "https://js.storylane.io/js/v1/analytics.js"
    document.head.appendChild(sl_analytics);

    // storylane styles
    const sl_css = `
      .sl-preview-img{
        width: 100%;
        height: 100%;
        webkit-filter: blur(1px);
        filter: blur(1px);
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: inherit;
        z-index: 999991;
      }
      .sl-ripple-backdrop{
        width: 75px;
        height: 75px;
        webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
        background-color: rgba(0, 0, 0, 0);
        position: absolute;
        top: 20%;
        left: 20%;
        z-index: 999991;
      }
      .sl-ripple-main {
          --ripple-max-size: 75px;
          --circle-size: 22px;
          --color: #9639e7;
          --border-animation-duration: 1.5s;
          --ripple-border-width: 8px;
          --ripple-timing-func: ease-in;

          width: var(--ripple-max-size);
          height: var(--ripple-max-size);
          position: absolute;
          top: 20%;
          left: 20%;
          z-index: 999990;
        }

      .sl-ripple-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--circle-size);
          height: var(--circle-size);
          transform: translate(-50%, -50%);
          background-color: var(--color);
          border-radius: 50%;
        }

      .sl-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: var(--ripple-border-width) solid var(--color);
          animation: enlargeSlRipple var(--border-animation-duration) var(--ripple-timing-func) infinite;
          animation-delay: 2s;
          transition-delay: 2s;
        }

        @keyframes enlargeSlRipple {
          0% {width: 0px; height: 0px; opacity: 1;}
          50% {opacity: 0.75;}
          100% {width: var(--ripple-max-size); height: var(--ripple-max-size); opacity: 0; border-width: 0;}
        }
    `;

    const sl_style = document.createElement('style');
    sl_style.innerHTML = sl_css;
    document.head.appendChild(sl_style);

    const sl_ripple = `
      <div class="sl-ripple-backdrop"></div>
      <div class="sl-ripple-main">
        <div class="sl-ripple-center" style="background-color: $ripple_color"></div>
        <div class="sl-ripple" style="border: 8px solid $ripple_color"></div>
      </div>
    `;

    const sl_previews = document.querySelectorAll('.sl-preview');
    if(sl_previews.length>0){
      for (const preview of sl_previews) {
        let ripple_color = '#9639e7';
        let sl_ripple_html = sl_ripple;
        let cta = preview.parentElement.parentElement.querySelector('.sl-preview-cta');
        if(cta != null){
          ripple_color = cta.style.backgroundColor;
        }
        let preview_image = document.createElement('img');
        preview_image.src = preview.style.backgroundImage.match(/(https?:\/\/[^ |'|"]*)/)[0];
        preview_image.classList = 'sl-preview-img';
        preview.appendChild(preview_image);
        preview.style.backgroundImage = '';
        preview.parentElement.style.borderRadius = '10px';
        preview.style.borderRadius = 'inherit';
        preview.innerHTML += sl_ripple_html.replaceAll(/\$ripple_color/g, ripple_color);
      }
    }

    // const sl_wrappers = document.querySelectorAll('.sl-embed-wrapper');
    // if(sl_wrappers.length>0){
    //   for (const wrapper of sl_wrappers) {
    //     let width = wrapper.getAttribute('data-sl-width');
    //     let height = wrapper.getAttribute('data-sl-height');
    //
    //     if(width != null && height != null){
    //       let width = parseFloat(width);
    //       let height = parseFloat(height);
    //       let ratio = parseFloat(height / width);
    //       let screen_height = window.innerHeight - 50;
    //
    //       wrapper_width = width;
    //       if (height > screen_height){
    //         wrapper_width = (screen_height / ratio).toFixed(2);
    //       }
    //       wrapper.style.width = wrapper_width;
    //     }else{
    //       wrapper.style.width = "90%";
    //     }
    //   }
    // }

    const sl_btns = document.querySelectorAll('.sl-demo-btn');
    if(sl_btns.length>0){
      for (const btn of sl_btns) {
        Storylane.Player(
          { element: btn,
            demo_url: btn.getAttribute('data-sl-url'),
            scale: btn.getAttribute('data-sl-scale')
          });
      }
    }

    const sl_popup_links = document.querySelectorAll('a[href*="?sl_popup"],a[href*="&sl_popup"]');
    if(sl_popup_links.length>0){
      for (const popup_link of sl_popup_links) {
        let demo_url = new URL(popup_link.getAttribute('href'));
        let demo_url_params = new URLSearchParams(demo_url.search);

        let encoded_config = demo_url_params.get('config');
        let demo_config = encoded_config && encoded_config.length ? JSON.parse(atob(encoded_config)) : {};

        demo_url_params.delete('config');
        demo_url_params.delete('sl_popup');
        demo_url.search = demo_url_params.toString();

        const default_config = {
          element: popup_link,
          demo_url: demo_url,
          type: 'popup'
        };

        popup_link.onclick = function(e){
          e.preventDefault();
          Storylane.Play({...default_config, ...demo_config});
        }
      }
    }

    const sl_embeds = document.querySelectorAll('.sl-inline-embed');
    if(sl_embeds.length>0){
      for (const embed of sl_embeds) {
        Storylane.Embed(
            { element: embed,
              demo_preview: embed.getAttribute('data-sl-preview'),
              demo_url: embed.getAttribute('data-sl-url'),
              scale: embed.getAttribute('data-sl-scale')
            });
      }
    }
  });

  window.addEventListener("message", (messageEvent) => {
    try {
      if (messageEvent.data.message === "storylane-demo-event") {
        let payload = messageEvent.data.payload;
        if (payload.event === "open_external_url" && payload.target.target === '_self') {
          window.open(payload.target.url, payload.target.target);
        }
      }

      if (messageEvent.data.source === "storylane-embed-demo") {

        let url = new URL(window.location);
        let url_query = url.searchParams;

        let email = url_query.get('email');
        url_query.delete('email');

        let token_keys = [];
        let tokens = {};
        for (const [key, value] of url_query.entries()) {
            if(key.match(/token/) != null){
                token_keys.push(key);
                let sub_key = key.match(/^token\[(.*)]$/)[1];
                tokens[sub_key] = value;
            }
        };
        for (const key of token_keys) { url_query.delete(key); };

        if (email) {
          messageEvent.source.postMessage(
            {
              source: "storylane-demo-host",
              lead: { email: email }
            },
            messageEvent.origin
          );
        }

        if (Object.keys(tokens).length > 0) {
          messageEvent.source.postMessage(
            {
              message: "storylane-token-submit",
              payload: { token: tokens }
            },
            messageEvent.origin
          );
        }

        messageEvent.source.postMessage(
          {
            source: "storylane-host-info",
            host: {url: window.location.href},
            url_query: url_query.toString()
          },
          messageEvent.origin
        );

        messageEvent.source.postMessage(
          {
            source: "storylane-tracking",
            tracking: document.cookie,
          },
          messageEvent.origin
        );
      }
    } catch (error) {
      console.error(error);
    }
  });
};
