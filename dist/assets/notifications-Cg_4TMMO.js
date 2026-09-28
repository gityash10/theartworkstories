import{a as e,i as t,n,r,t as i}from"./jsx-runtime-CN6xb7vE.js";import"./modulepreload-polyfill-Dezn_h7o.js";import{t as a}from"./bell-CVavTj-D.js";import{t as o}from"./bookmark-C3HSXmEB.js";import{t as s}from"./check-DWQICR9U.js";import{t as c}from"./compass-hXzHL4tI.js";import{t as l}from"./heart-fI321-2o.js";import{t as u}from"./message-circle-ub0qwuFi.js";import{t as d}from"./settings-BMRHlAt0.js";import{t as f}from"./user-plus-Cv-c2Y8f.js";import{t as p}from"./users-B4ImNgsQ.js";var m=n(`check-check`,[[`path`,{d:`M18 6 7 17l-5-5`,key:`116fxf`}],[`path`,{d:`m22 10-7.5 7.5L13 16`,key:`ke71qq`}]]),h=e(r(),1),g=e(t(),1),_=i(),v=[{id:1,type:`like`,title:`Someone liked your artwork`,description:`"The Silent Conversation" received a new like.`,time:`10 min ago`,read:!1},{id:2,type:`comment`,title:`New comment on your artwork`,description:`Someone commented on "The Silent Conversation".`,time:`1 hour ago`,read:!1},{id:3,type:`follow`,title:`You have a new follower`,description:`Someone started following your profile.`,time:`3 hours ago`,read:!1},{id:4,type:`mention`,title:`You were mentioned`,description:`Someone mentioned you in an artwork story.`,time:`Yesterday`,read:!0},{id:5,type:`collection`,title:`Collection activity`,description:`There is new activity in a collection you follow.`,time:`Yesterday`,read:!0}],y={like:(0,_.jsx)(l,{size:20}),comment:(0,_.jsx)(u,{size:20}),follow:(0,_.jsx)(f,{size:20}),mention:(0,_.jsx)(p,{size:20}),collection:(0,_.jsx)(o,{size:20})},b={like:`notification-icon like`,comment:`notification-icon comment`,follow:`notification-icon follow`,mention:`notification-icon mention`,collection:`notification-icon collection`};function x({type:e}){return(0,_.jsx)(`div`,{className:b[e],children:y[e]})}function S(){let[e,t]=(0,g.useState)(v),[n,r]=(0,g.useState)(`all`),i=(0,g.useMemo)(()=>e.filter(e=>!e.read).length,[e]),l=(0,g.useMemo)(()=>n===`unread`?e.filter(e=>!e.read):e,[n,e]),u=e=>{t(t=>t.map(t=>t.id===e?{...t,read:!0}:t))};return(0,_.jsxs)(`div`,{className:`notifications-page`,children:[(0,_.jsx)(`style`,{children:`
        * {
          box-sizing: border-box;
        }

        .notifications-page {
          min-height: 100vh;
          background: #f5f0e7;
          color: #171714;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .notifications-layout {
          min-height: 100vh;
          display: flex;
        }

        /* SIDEBAR */

        .notifications-sidebar {
          width: 242px;
          min-width: 242px;
          background: #1d1d1b;
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
        }

        .sidebar-brand {
          height: 107px;
          padding: 20px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          line-height: 0.95;
        }

        .sidebar-nav {
          padding: 38px 12px 0;
        }

        .sidebar-section {
          padding: 0 0 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-link {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 18px;
          color: #d9d5ce;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .sidebar-link svg {
          flex-shrink: 0;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 26px;
        }

        .sidebar-quote {
          color: #cfc8bd;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          line-height: 1.6;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        /* MAIN */

        .notifications-main {
          width: calc(100% - 242px);
          margin-left: 242px;
          min-height: 100vh;
        }

        /* CONTENT */

        .notifications-content {
          max-width: 950px;
          margin: 0 auto;
          padding: 58px 30px 80px;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 34px;
        }

        .page-heading h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -0.7px;
        }

        .page-heading p {
          margin: 10px 0 0;
          color: #777169;
          font-size: 16px;
        }

        .mark-all-button {
          border: 1px solid #d8d1c6;
          background: #fffdf9;
          color: #36332e;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          white-space: nowrap;
        }

        .mark-all-button:hover {
          background: #eee9df;
        }

        .notification-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .filter-tabs {
          display: flex;
          gap: 5px;
          background: #ebe6dd;
          border-radius: 9px;
          padding: 4px;
        }

        .filter-tab {
          border: none;
          background: transparent;
          padding: 8px 16px;
          border-radius: 6px;
          color: #716c64;
          cursor: pointer;
          font-size: 14px;
        }

        .filter-tab.active {
          background: #fffdf9;
          color: #1f1e1b;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .unread-count {
          color: #817b72;
          font-size: 14px;
        }

        .notification-list {
          background: #fffdf9;
          border: 1px solid #ded8cd;
          border-radius: 14px;
          overflow: hidden;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 22px 24px;
          border-bottom: 1px solid #e7e1d8;
          position: relative;
          transition: background 0.2s ease;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: #faf7f1;
        }

        .notification-item.unread {
          background: #faf6ed;
        }

        .notification-item.unread::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #292824;
        }

        .notification-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon.like {
          background: #f0dfd9;
          color: #9b4b3a;
        }

        .notification-icon.comment {
          background: #e2e9df;
          color: #52664e;
        }

        .notification-icon.follow {
          background: #e4e1ec;
          color: #5c5575;
        }

        .notification-icon.mention {
          background: #e5e9e9;
          color: #536568;
        }

        .notification-icon.collection {
          background: #ebe2d4;
          color: #806541;
        }

        .notification-body {
          min-width: 0;
          flex: 1;
        }

        .notification-title {
          margin: 0 0 5px;
          font-size: 15px;
          font-weight: 600;
          color: #24231f;
        }

        .notification-description {
          margin: 0;
          color: #777169;
          font-size: 14px;
          line-height: 1.45;
        }

        .notification-time {
          margin-top: 8px;
          color: #999289;
          font-size: 12px;
        }

        .notification-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-action {
          width: 34px;
          height: 34px;
          border: 1px solid #ddd6cc;
          border-radius: 7px;
          background: #fffdf9;
          color: #716c64;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-action:hover {
          background: #eee9df;
          color: #24231f;
        }

        .empty-state {
          padding: 75px 25px;
          text-align: center;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          margin: 0 auto 18px;
          background: #eee9df;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777169;
        }

        .empty-state h2 {
          margin: 0 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: 25px;
        }

        .empty-state p {
          margin: 0;
          color: #817b72;
        }

        /* MOBILE */

        @media (max-width: 900px) {
          .notifications-sidebar {
            position: relative;
            width: 100%;
            min-width: 0;
            min-height: auto;
            height: auto;
          }

          .notifications-layout {
            display: block;
          }

          .notifications-main {
            width: 100%;
            margin-left: 0;
          }

          .sidebar-brand {
            height: auto;
          }

          .sidebar-nav {
            padding: 15px 12px;
          }

          .sidebar-section {
            margin-bottom: 10px;
            padding-bottom: 10px;
          }

          .sidebar-footer {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .notifications-content {
            padding: 35px 16px 60px;
          }

          .page-heading {
            flex-direction: column;
          }

          .page-heading h1 {
            font-size: 34px;
          }

          .notification-toolbar {
            align-items: flex-start;
            gap: 12px;
            flex-direction: column;
          }

          .notification-item {
            align-items: flex-start;
            padding: 18px 16px;
            gap: 13px;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .notification-icon svg {
            width: 17px;
            height: 17px;
          }

          .notification-actions {
            align-self: center;
          }
        }
      `}),(0,_.jsxs)(`div`,{className:`notifications-layout`,children:[(0,_.jsxs)(`aside`,{className:`notifications-sidebar`,children:[(0,_.jsxs)(`div`,{className:`sidebar-brand`,children:[`The ArtWork`,(0,_.jsx)(`br`,{}),`Stories`]}),(0,_.jsxs)(`nav`,{className:`sidebar-nav`,children:[(0,_.jsxs)(`div`,{className:`sidebar-section`,children:[(0,_.jsxs)(`a`,{className:`sidebar-link`,href:`/pages/app/discover/index.html`,children:[(0,_.jsx)(c,{size:20}),(0,_.jsx)(`span`,{children:`Discover`})]}),(0,_.jsxs)(`a`,{className:`sidebar-link`,href:`/pages/app/collections/index.html`,children:[(0,_.jsx)(o,{size:20}),(0,_.jsx)(`span`,{children:`Collections`})]})]}),(0,_.jsx)(`div`,{className:`sidebar-section`,children:(0,_.jsxs)(`a`,{className:`sidebar-link`,href:`/pages/app/create/index.html`,children:[(0,_.jsx)(`span`,{style:{fontSize:27,lineHeight:1},children:`+`}),(0,_.jsx)(`span`,{children:`Share an Artwork`})]})}),(0,_.jsxs)(`div`,{className:`sidebar-section`,children:[(0,_.jsxs)(`a`,{className:`sidebar-link`,href:`/pages/app/profile/index.html`,children:[(0,_.jsx)(p,{size:20}),(0,_.jsx)(`span`,{children:`Profile`})]}),(0,_.jsxs)(`a`,{className:`sidebar-link`,href:`/pages/app/settings/account/index.html`,children:[(0,_.jsx)(d,{size:20}),(0,_.jsx)(`span`,{children:`Settings`})]})]})]}),(0,_.jsx)(`div`,{className:`sidebar-footer`,children:(0,_.jsxs)(`div`,{className:`sidebar-quote`,children:[`“Art is a conversation`,(0,_.jsx)(`br`,{}),`across time.”`]})})]}),(0,_.jsx)(`main`,{className:`notifications-main`,children:(0,_.jsxs)(`section`,{className:`notifications-content`,children:[(0,_.jsxs)(`div`,{className:`page-heading`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h1`,{children:`Notifications`}),(0,_.jsx)(`p`,{children:`Stay up to date with what is happening around your art.`})]}),i>0&&(0,_.jsxs)(`button`,{className:`mark-all-button`,onClick:()=>{t(e=>e.map(e=>({...e,read:!0})))},children:[(0,_.jsx)(m,{size:17}),`Mark all as read`]})]}),(0,_.jsxs)(`div`,{className:`notification-toolbar`,children:[(0,_.jsxs)(`div`,{className:`filter-tabs`,children:[(0,_.jsx)(`button`,{className:`filter-tab ${n===`all`?`active`:``}`,onClick:()=>r(`all`),children:`All`}),(0,_.jsx)(`button`,{className:`filter-tab ${n===`unread`?`active`:``}`,onClick:()=>r(`unread`),children:`Unread`})]}),(0,_.jsxs)(`span`,{className:`unread-count`,children:[i,` unread`]})]}),(0,_.jsx)(`div`,{className:`notification-list`,children:l.length===0?(0,_.jsxs)(`div`,{className:`empty-state`,children:[(0,_.jsx)(`div`,{className:`empty-icon`,children:(0,_.jsx)(a,{size:25})}),(0,_.jsx)(`h2`,{children:`You’re all caught up`}),(0,_.jsx)(`p`,{children:`There are no unread notifications right now.`})]}):l.map(e=>(0,_.jsxs)(`article`,{className:`notification-item ${e.read?``:`unread`}`,children:[(0,_.jsx)(x,{type:e.type}),(0,_.jsxs)(`div`,{className:`notification-body`,children:[(0,_.jsx)(`h3`,{className:`notification-title`,children:e.title}),(0,_.jsx)(`p`,{className:`notification-description`,children:e.description}),(0,_.jsx)(`div`,{className:`notification-time`,children:e.time})]}),!e.read&&(0,_.jsx)(`div`,{className:`notification-actions`,children:(0,_.jsx)(`button`,{className:`notification-action`,onClick:()=>u(e.id),"aria-label":`Mark as read`,title:`Mark as read`,children:(0,_.jsx)(s,{size:17})})})]},e.id))})]})})]})]})}var C=document.getElementById(`root`);if(!C)throw Error(`Root element not found`);(0,h.createRoot)(C).render((0,_.jsx)(g.StrictMode,{children:(0,_.jsx)(S,{})}));