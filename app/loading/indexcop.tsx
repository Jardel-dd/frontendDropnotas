// import {LoadingDropDeskType} from "@dropDesk/presentation/components/loadings/loading_dropdesk/loading_dropdesk";
// import {useTranslation} from "react-i18next";
// import FullScreenOverlay from "@dropDesk/presentation/components/overlay/full_screen_overlay";
// import {observer} from "mobx-react";
// import {useInjection} from "inversify-react";

// const DropDeskLoading = (observer((props: LoadingDropDeskType) => {

//     const appController = useInjection(AppController);
//     const colors = appController.theme.colorScheme;
//     const {RiveComponent} = useRive({
//         src: loadingDropDeskRiv,
//         animations: `loading-${colors.name}`,
//         autoplay: true,
//     });

//     const {t} = useTranslation();
//     const opacity = 0.7;
//     const background = colors.isDarkTheme ? colors.background : colors.onBackground;
//     return (

//         <FullScreenOverlay
//             background={background}
//             opacity={opacity}
//             style={{zIndex: 99999}}
//             onClick={() => {
//             }}
//             children={
//                 <Container>
//                     <RiveComponent style={{height: props.height}}/>
//                     {props.description &&
//                         <ContentDescription>
//                             <Description
//                                 color={colors.text}>{t(props.description)}</Description>
//                         </ContentDescription>
//                     }
//                 </Container>
//             }
//         />

//     )
// }));

// export default DropDeskLoading;
