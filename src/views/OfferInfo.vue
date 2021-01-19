<template>
    <div v-if="isLoaded && offerInfo && offerInfo.id">
        <div class="dashboard-hero hero-img-overlay"
             style="background-image: url('../assets/images/data/images/dashboard/reserved/meal.jpg');">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleLightColor mb-2">{{offerInfo.meal.name}}</div>
                        <!-- TODO: use router-link to redirect to user's profile later -->
                        <div class="cook-box">
                            <div class="cook-info justify-content-center">
                                <div class="cook-info-img mr-3">
                                    <img src="../assets/images/data/images/avatars/cook2.jpg" alt="" class="img-fluid">
                                </div>
                                <div class="cook-info-part">
                                    <div class="cook-info-name titleLightColor mr-2">{{userName}}</div>
                                    <div class="cook-info-benefits">
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit3"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit2"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit1"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box longbox">
                                            <SvgIcon icon="star"></SvgIcon>
                                            <span>4.3</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-4 order-lg-2">
                        <!-- TODO: I'm hiding this block if current user owns this order. I'll check it later -->
                        <div class="reserved-btn" v-if="offerInfo.user.id !== currentUserId">
                            <b-btn
                                    class="main-btn w-100 btn-green hover-slide-left transparent mb-2"
                                    v-if="offerInfo.availableQuantity > 0 && !wasReserved"
                                    @click="showReserveMealModal"
                            >
                                <span>Reserve Meal</span>
                            </b-btn>
                            <div class="meal-reserved-info w-100 mb-2" v-if="wasReserved">Meal Reserved!</div>
                            <b-btn class="main-btn w-100 btn-green smaller-btn hover-slide-left transparent mb-2" @click="showContactCookModal">
                                <span>Contact cook</span>
                            </b-btn>
                            <b-btn
                                    class="main-btn w-100 btn-red-dark smaller-btn hover-slide-left transparent"
                                    v-if="wasReserved"
                                    @click="cancelReservation"
                            >
                                <span>Cancel reservation</span>
                            </b-btn>
                        </div>

                        <div class="cook-box">
                            <div class="cook-info-additional">
                                <div class="serving-number mt-1">
                                    <span>{{offerInfo.availableQuantity}}</span> of {{offerInfo.quantity}} servings available
                                </div>
                                <div class="cook-time mt-2">
                                    <SvgIcon icon="clock"></SvgIcon>
                                    <span class="ml-2">{{readyTimeStr}}</span>
                                </div>
                                <div class="cook-location mt-2">
                                    <SvgIcon icon="location"></SvgIcon>
                                    <span class="ml-2">{{offerInfo.place.address}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 order-lg-1">
                        <div class="title-size3 titleGreenNavyColor">About this meal</div>
                        <template v-if="offerInfo.meal.description && offerInfo.meal.description.length">{{offerInfo.meal.description}}</template>

                        <template v-if="offerInfo.meal.dietaryNotes && offerInfo.meal.dietaryNotes.length">
                            <div class="title-size3 titleGreenNavyColor mt-4">Dietary Notes</div>
                            <ul class="dietary-notes">
                                <li v-for="note in offerInfo.meal.dietaryNotes">{{note.text}}</li>
                            </ul>
                        </template>
                    </div>
                </div>

                <!-- TODO: questions section -->
                <div class="row mt-4">
                    <div class="col-md-12">
                        <div class="title-size3 titleGreenNavyColor">2 Questions</div>
                    </div>
                </div>

                <!-- TODO: load more offers from the same user -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="reserved">
                            <div class="title-size3 titleGreenNavyColor mb-3">More from {{userName}}</div>
                        </div>
                    </div>

                    <!-- TODO: temp hidden -->
                    <div class="col-12 d-none">
                        <div class="carousel-reserved owl-carousel">
                            <a class="item" href="">
                                <div class="recept-box">
                                    <div class="recept-box-img recept-box-img-overlay">
                                        <img src="../assets/images/data/images/dashboard/recepts/lasania.jpg" alt=""
                                             class="img-fluid">
                                        <div class="recept-box-title">
                                            <div class="title-size3 titleLightColor">Fish Tacos</div>
                                            <div class="serving-number mt-1 titleLightColor"><span
                                                    class="titleLightColor">2</span> servings
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cook-box pb-2 pb-md-3">
                                        <div class="cook-info p-2 p-sm-3">
                                            <div class="cook-info-img mr-2 mr-xl-3">
                                                <img src="../assets/images/data/images/avatars/cook2.jpg" alt=""
                                                     class="img-fluid">
                                            </div>
                                            <div class="cook-info-part">
                                                <div class="cook-info-name mr-2">Winnifred P.</div>
                                                <div class="cook-info-benefits mt-1">
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M6.85.975a.66.66 0 00-.793.12.718.718 0 00-.125.819 5.884 5.884 0 01.02 5.147.134.134 0 01-.119.071.134.134 0 01-.117-.074 3.196 3.196 0 01-.303-.877.418.418 0 00-.26-.31.393.393 0 00-.39.066c-1.552 1.28-2.154 3.432-1.505 5.37.615 1.83 2.32 3.022 4.19 2.929 2.287 0 3.886-1.2 4.389-3.29.745-3.088-1.085-7.831-4.986-9.97zm2.562 10.003c-.135.96-.962 1.65-1.897 1.582-.893 0-1.658-.662-1.814-1.572a.286.286 0 01.08-.253.264.264 0 01.248-.07 1.614 1.614 0 001.352-.788 1.32 1.32 0 00.245-1.376.287.287 0 01.03-.32.264.264 0 01.3-.08c1.064.502 1.664 1.686 1.456 2.877z"
                                                                        fill="#F06A25" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#C94727" fill-rule="nonzero">
                                                                    <path
                                                                            d="M3.821 12.016a.268.268 0 00-.202.091.283.283 0 00-.069.215l.111 1.168c.04.427.391.753.81.751h4.975a.818.818 0 00.808-.753l.109-1.168a.283.283 0 00-.07-.214.268.268 0 00-.201-.091l-6.271.001zM12.833 5.448a2.376 2.376 0 00-1.265-1.54 2.35 2.35 0 00-.957-.24.272.272 0 01-.252-.196C9.899 1.94 8.52.892 6.959.892c-1.563 0-2.942 1.047-3.401 2.58a.272.272 0 01-.253.197 2.348 2.348 0 00-.957.24 2.376 2.376 0 00-1.265 1.54 2.493 2.493 0 00.405 2.126c.37.49.905.82 1.5.925.12.022.21.123.223.247l.207 2.184a.274.274 0 00.27.251h6.54c.14 0 .257-.108.27-.25l.208-2.185a.275.275 0 01.223-.247 2.4 2.4 0 001.5-.925c.45-.605.6-1.392.404-2.127z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#18B585" fill-rule="nonzero">
                                                                    <path
                                                                            d="M6.258 10.419a.138.138 0 00.071-.078.145.145 0 00-.003-.107L4.82 6.85c-.84-1.89-.551-3.687.683-4.765a.282.282 0 00-.03-.445 2.74 2.74 0 00-2.76-.174c-1.65.772-2.168 2.619-1.29 4.593l2.325 5.231c.03.068.084.12.152.146a.264.264 0 00.207-.008l2.152-1.008zM4.444 12.186a.281.281 0 00-.134.368l.232.522c.06.135.168.24.303.293a.529.529 0 00.415-.014l1.782-.835a.275.275 0 00.142-.155.285.285 0 00-.008-.213l-.4-.902a.134.134 0 00-.18-.068l-2.152 1.004z" />
                                                                    <path
                                                                            d="M13.025 9.631a.275.275 0 00.141-.155.285.285 0 00-.007-.213l-.13-.29a.86.86 0 01-.053-.537l.744-3.281a1.42 1.42 0 00-.538-1.342 1.336 1.336 0 00-1.408-.134c-.256.124-.466.33-.6.586a.134.134 0 01-.123.073.136.136 0 01-.119-.08l-.1-.228c-.878-1.974-2.577-2.78-4.226-2.009-1.648.772-2.166 2.621-1.291 4.595l2.324 5.234c.062.14.223.201.359.137l5.027-2.356zM13.684 11.787a.562.562 0 00.267-.737l-.232-.523a.274.274 0 00-.151-.145.264.264 0 00-.208.008l-5.025 2.356a.281.281 0 00-.134.368l.232.521c.06.135.169.24.304.29a.529.529 0 00.414-.014l4.533-2.124z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box longbox">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 15 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M14.057 5.357a.898.898 0 00-.838-.6H9.593a.298.298 0 01-.281-.204L8.01.765A.895.895 0 007.173.17a.895.895 0 00-.837.596l-.003.01-1.298 3.778a.298.298 0 01-.281.205H1.127a.895.895 0 00-.84.604.933.933 0 00.266 1.017l3.088 2.63c.095.081.131.213.093.333l-1.298 3.994a.931.931 0 00.321 1.032.875.875 0 001.055-.002l3.185-2.397a.292.292 0 01.352 0l3.183 2.397a.875.875 0 001.056.003.931.931 0 00.322-1.033L10.612 9.34a.311.311 0 01.093-.332l3.094-2.634a.934.934 0 00.258-1.016z"
                                                                        fill="#EFBF41" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                        <span>4.3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                                class="cook-info-additional pl-3 pr-3 pl-sm-4 pr-sm-4 pl-md-5 pr-md-5">
                                            <div class="cook-time">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path
                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"
                                                            fill="rgba(24,24,22,0.5)" />
                                                </svg><span class="ml-3">Ready at 5pm today</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="item" href="">
                                <div class="recept-box">
                                    <div class="recept-box-img">
                                        <img src="../assets/images/data/images/dashboard/recepts/card__img-placeholder.svg"
                                             alt="" class="img-fluid">
                                        <div class="recept-box-title">
                                            <div class="title-size3 titleLightColor">Classic Lasagna</div>
                                            <div class="serving-number mt-1 titleLightColor"><span
                                                    class="titleLightColor">2</span> servings
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cook-box pb-2 pb-md-3">
                                        <div class="cook-info p-2 p-sm-3">
                                            <div class="cook-info-img mr-2 mr-xl-3">
                                                <img src="../assets/images/data/images/avatars/cook2.jpg" alt=""
                                                     class="img-fluid">
                                            </div>
                                            <div class="cook-info-part">
                                                <div class="cook-info-name mr-2">Winnifred P.</div>
                                                <div class="cook-info-benefits mt-1">
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M6.85.975a.66.66 0 00-.793.12.718.718 0 00-.125.819 5.884 5.884 0 01.02 5.147.134.134 0 01-.119.071.134.134 0 01-.117-.074 3.196 3.196 0 01-.303-.877.418.418 0 00-.26-.31.393.393 0 00-.39.066c-1.552 1.28-2.154 3.432-1.505 5.37.615 1.83 2.32 3.022 4.19 2.929 2.287 0 3.886-1.2 4.389-3.29.745-3.088-1.085-7.831-4.986-9.97zm2.562 10.003c-.135.96-.962 1.65-1.897 1.582-.893 0-1.658-.662-1.814-1.572a.286.286 0 01.08-.253.264.264 0 01.248-.07 1.614 1.614 0 001.352-.788 1.32 1.32 0 00.245-1.376.287.287 0 01.03-.32.264.264 0 01.3-.08c1.064.502 1.664 1.686 1.456 2.877z"
                                                                        fill="#F06A25" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#C94727" fill-rule="nonzero">
                                                                    <path
                                                                            d="M3.821 12.016a.268.268 0 00-.202.091.283.283 0 00-.069.215l.111 1.168c.04.427.391.753.81.751h4.975a.818.818 0 00.808-.753l.109-1.168a.283.283 0 00-.07-.214.268.268 0 00-.201-.091l-6.271.001zM12.833 5.448a2.376 2.376 0 00-1.265-1.54 2.35 2.35 0 00-.957-.24.272.272 0 01-.252-.196C9.899 1.94 8.52.892 6.959.892c-1.563 0-2.942 1.047-3.401 2.58a.272.272 0 01-.253.197 2.348 2.348 0 00-.957.24 2.376 2.376 0 00-1.265 1.54 2.493 2.493 0 00.405 2.126c.37.49.905.82 1.5.925.12.022.21.123.223.247l.207 2.184a.274.274 0 00.27.251h6.54c.14 0 .257-.108.27-.25l.208-2.185a.275.275 0 01.223-.247 2.4 2.4 0 001.5-.925c.45-.605.6-1.392.404-2.127z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#18B585" fill-rule="nonzero">
                                                                    <path
                                                                            d="M6.258 10.419a.138.138 0 00.071-.078.145.145 0 00-.003-.107L4.82 6.85c-.84-1.89-.551-3.687.683-4.765a.282.282 0 00-.03-.445 2.74 2.74 0 00-2.76-.174c-1.65.772-2.168 2.619-1.29 4.593l2.325 5.231c.03.068.084.12.152.146a.264.264 0 00.207-.008l2.152-1.008zM4.444 12.186a.281.281 0 00-.134.368l.232.522c.06.135.168.24.303.293a.529.529 0 00.415-.014l1.782-.835a.275.275 0 00.142-.155.285.285 0 00-.008-.213l-.4-.902a.134.134 0 00-.18-.068l-2.152 1.004z" />
                                                                    <path
                                                                            d="M13.025 9.631a.275.275 0 00.141-.155.285.285 0 00-.007-.213l-.13-.29a.86.86 0 01-.053-.537l.744-3.281a1.42 1.42 0 00-.538-1.342 1.336 1.336 0 00-1.408-.134c-.256.124-.466.33-.6.586a.134.134 0 01-.123.073.136.136 0 01-.119-.08l-.1-.228c-.878-1.974-2.577-2.78-4.226-2.009-1.648.772-2.166 2.621-1.291 4.595l2.324 5.234c.062.14.223.201.359.137l5.027-2.356zM13.684 11.787a.562.562 0 00.267-.737l-.232-.523a.274.274 0 00-.151-.145.264.264 0 00-.208.008l-5.025 2.356a.281.281 0 00-.134.368l.232.521c.06.135.169.24.304.29a.529.529 0 00.414-.014l4.533-2.124z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box longbox">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 15 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M14.057 5.357a.898.898 0 00-.838-.6H9.593a.298.298 0 01-.281-.204L8.01.765A.895.895 0 007.173.17a.895.895 0 00-.837.596l-.003.01-1.298 3.778a.298.298 0 01-.281.205H1.127a.895.895 0 00-.84.604.933.933 0 00.266 1.017l3.088 2.63c.095.081.131.213.093.333l-1.298 3.994a.931.931 0 00.321 1.032.875.875 0 001.055-.002l3.185-2.397a.292.292 0 01.352 0l3.183 2.397a.875.875 0 001.056.003.931.931 0 00.322-1.033L10.612 9.34a.311.311 0 01.093-.332l3.094-2.634a.934.934 0 00.258-1.016z"
                                                                        fill="#EFBF41" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                        <span>4.3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                                class="cook-info-additional pl-3 pr-3 pl-sm-4 pr-sm-4 pl-md-5 pr-md-5">
                                            <div class="cook-time">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path
                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"
                                                            fill="rgba(24,24,22,0.5)" />
                                                </svg><span class="ml-3">Ready at 5pm today</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="item" href="">
                                <div class="recept-box">
                                    <div class="recept-box-img">
                                        <img src="../assets/images/data/images/dashboard/recepts/card__img-placeholder-2.svg"
                                             alt="" class="img-fluid">
                                        <div class="recept-box-title">
                                            <div class="title-size3 titleLightColor">Eggplant Parmesan with long
                                                name
                                                Eggplant
                                                Parmesan</div>
                                            <div class="serving-number mt-1 titleLightColor"><span
                                                    class="titleLightColor">12</span>
                                                servings
                                            </div>
                                        </div>
                                    </div>
                                    <div class="cook-box pb-2 pb-md-3">
                                        <div class="cook-info p-2 p-sm-3">
                                            <div class="cook-info-img mr-2 mr-xl-3">
                                                <img src="../assets/images/data/images/avatars/cook2.jpg" alt=""
                                                     class="img-fluid">
                                            </div>
                                            <div class="cook-info-part">
                                                <div class="cook-info-name mr-2">Winnifred P.</div>
                                                <div class="cook-info-benefits mt-1">
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M6.85.975a.66.66 0 00-.793.12.718.718 0 00-.125.819 5.884 5.884 0 01.02 5.147.134.134 0 01-.119.071.134.134 0 01-.117-.074 3.196 3.196 0 01-.303-.877.418.418 0 00-.26-.31.393.393 0 00-.39.066c-1.552 1.28-2.154 3.432-1.505 5.37.615 1.83 2.32 3.022 4.19 2.929 2.287 0 3.886-1.2 4.389-3.29.745-3.088-1.085-7.831-4.986-9.97zm2.562 10.003c-.135.96-.962 1.65-1.897 1.582-.893 0-1.658-.662-1.814-1.572a.286.286 0 01.08-.253.264.264 0 01.248-.07 1.614 1.614 0 001.352-.788 1.32 1.32 0 00.245-1.376.287.287 0 01.03-.32.264.264 0 01.3-.08c1.064.502 1.664 1.686 1.456 2.877z"
                                                                        fill="#F06A25" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#C94727" fill-rule="nonzero">
                                                                    <path
                                                                            d="M3.821 12.016a.268.268 0 00-.202.091.283.283 0 00-.069.215l.111 1.168c.04.427.391.753.81.751h4.975a.818.818 0 00.808-.753l.109-1.168a.283.283 0 00-.07-.214.268.268 0 00-.201-.091l-6.271.001zM12.833 5.448a2.376 2.376 0 00-1.265-1.54 2.35 2.35 0 00-.957-.24.272.272 0 01-.252-.196C9.899 1.94 8.52.892 6.959.892c-1.563 0-2.942 1.047-3.401 2.58a.272.272 0 01-.253.197 2.348 2.348 0 00-.957.24 2.376 2.376 0 00-1.265 1.54 2.493 2.493 0 00.405 2.126c.37.49.905.82 1.5.925.12.022.21.123.223.247l.207 2.184a.274.274 0 00.27.251h6.54c.14 0 .257-.108.27-.25l.208-2.185a.275.275 0 01.223-.247 2.4 2.4 0 001.5-.925c.45-.605.6-1.392.404-2.127z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 14 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <g fill="#18B585" fill-rule="nonzero">
                                                                    <path
                                                                            d="M6.258 10.419a.138.138 0 00.071-.078.145.145 0 00-.003-.107L4.82 6.85c-.84-1.89-.551-3.687.683-4.765a.282.282 0 00-.03-.445 2.74 2.74 0 00-2.76-.174c-1.65.772-2.168 2.619-1.29 4.593l2.325 5.231c.03.068.084.12.152.146a.264.264 0 00.207-.008l2.152-1.008zM4.444 12.186a.281.281 0 00-.134.368l.232.522c.06.135.168.24.303.293a.529.529 0 00.415-.014l1.782-.835a.275.275 0 00.142-.155.285.285 0 00-.008-.213l-.4-.902a.134.134 0 00-.18-.068l-2.152 1.004z" />
                                                                    <path
                                                                            d="M13.025 9.631a.275.275 0 00.141-.155.285.285 0 00-.007-.213l-.13-.29a.86.86 0 01-.053-.537l.744-3.281a1.42 1.42 0 00-.538-1.342 1.336 1.336 0 00-1.408-.134c-.256.124-.466.33-.6.586a.134.134 0 01-.123.073.136.136 0 01-.119-.08l-.1-.228c-.878-1.974-2.577-2.78-4.226-2.009-1.648.772-2.166 2.621-1.291 4.595l2.324 5.234c.062.14.223.201.359.137l5.027-2.356zM13.684 11.787a.562.562 0 00.267-.737l-.232-.523a.274.274 0 00-.151-.145.264.264 0 00-.208.008l-5.025 2.356a.281.281 0 00-.134.368l.232.521c.06.135.169.24.304.29a.529.529 0 00.414-.014l4.533-2.124z" />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <div class="cook-info-benefits-box longbox">
                                                        <svg width="14px" height="15px"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             xmlns:xlink="http://www.w3.org/1999/xlink"
                                                             viewBox="0 0 15 15">
                                                            <g fill="none" fill-rule="evenodd">
                                                                <path
                                                                        d="M14.057 5.357a.898.898 0 00-.838-.6H9.593a.298.298 0 01-.281-.204L8.01.765A.895.895 0 007.173.17a.895.895 0 00-.837.596l-.003.01-1.298 3.778a.298.298 0 01-.281.205H1.127a.895.895 0 00-.84.604.933.933 0 00.266 1.017l3.088 2.63c.095.081.131.213.093.333l-1.298 3.994a.931.931 0 00.321 1.032.875.875 0 001.055-.002l3.185-2.397a.292.292 0 01.352 0l3.183 2.397a.875.875 0 001.056.003.931.931 0 00.322-1.033L10.612 9.34a.311.311 0 01.093-.332l3.094-2.634a.934.934 0 00.258-1.016z"
                                                                        fill="#EFBF41" fill-rule="nonzero" />
                                                            </g>
                                                        </svg>
                                                        <span>4.3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                                class="cook-info-additional pl-3 pr-3 pl-sm-4 pr-sm-4 pl-md-5 pr-md-5">
                                            <div class="cook-time">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path
                                                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"
                                                            fill="rgba(24,24,22,0.5)" />
                                                </svg><span class="ml-3">Ready at 5pm today</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <ReserveMealModal :offer-info="{ ...this.offerInfo }" @onReserved="onReserved"></ReserveMealModal>
        <ContactCookModal :cook-id="this.offerInfo.user.id" :offer-id="this.offerInfo.id"></ContactCookModal>
    </div>
</template>

<script>
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import helpers from '../helpers';
import ReserveMealModal from '../components/modals/ReserveMealModal';
import ContactCookModal from '../components/modals/ContactCookModal';
export default {
    name: "OfferInfo",
    components: {SvgIcon, ReserveMealModal, ContactCookModal},
    data: () => ({
        offerId: '',
        offerInfo: {},
        isLoaded: false,
        errLoadingOffer: false,
        wasReserved: false,
        reservationId: '',
        numberOfServingsReserved: 0,
        currentUserId: ''
    }),
    mounted () {
        this.isLoaded = false;
        this.offerInfo = {};
        const { id = '' } = this.$route.params;
        this.offerId = id;
        this.getOfferInfo();
    },
    methods: {
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                this.$loader.hide();
            }
        },
        getOfferInfo () {
            if (!this.offerId) {
                this.errLoadingOffer = true;
                return;
            }
            api.dashboard.offers.getOfferById(this.offerId)
                .then(offer => {
                    if (offer.meal && offer.meal.dietaryNotes && offer.meal.dietaryNotes.length) {
                        offer.meal.dietaryNotes = helpers.retrieveDietaryNotes(offer.meal.dietaryNotes);
                    }
                    this.currentUserId = this.$store.getters.userId;
                    this.offerInfo = { ...offer };
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.errLoadingOffer = true;
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                })
        },
        showReserveMealModal () {
            this.$bvModal.show('reserve-meal-modal');
        },
        showContactCookModal () {
            this.$bvModal.show('contact-cook-modal');
        },
        onReserved (id, numOfServings) {
            this.wasReserved = true;
            this.reservationId = id;
            this.numberOfServingsReserved = numOfServings;
            if (this.offerInfo.availableQuantity) {
                this.offerInfo.availableQuantity -= this.numberOfServingsReserved;
            }
        },
        cancelReservation () {
            this.$bvModal.msgBoxConfirm('Are you sure you want to cancel reservation?')
                .then(value => {
                    if (value) {
                        api.dashboard.bookings.deleteDine(this.reservationId)
                            .then(() => {
                                this.offerInfo.availableQuantity += this.numberOfServingsReserved;
                                this.wasReserved = false;
                                this.reservationId = '';
                                this.numberOfServingsReserved = 0;
                            })
                            .catch(err => {
                                console.log('\n >> err > ', err);
                            })
                    }
                })
                .catch(err => {})
        }
    },
    computed: {
        userName: function () {
            return helpers.userNameWithShortLastName(this.offerInfo.user);
        },
        readyTimeStr: function () {
            return `Ready at ${helpers.parseDate(this.offerInfo.pickupTime, true)}`;
        },
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.meal-reserved-info {
    height: 64px;
    background-color: $yellowColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $textBlackColor;
    font-family: $LacaProSemiBold;
    font-size: 22px;
    letter-spacing: 1.15px;
    line-height: 26px;
    text-transform: uppercase;
}
</style>
