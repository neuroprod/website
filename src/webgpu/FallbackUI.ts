export class FallbackUI {
    private appElement: HTMLElement;

    constructor(appElement: HTMLElement) {
        this.appElement = appElement;
    }

    show(message: string) {
        // Clear the app element
        this.appElement.innerHTML = "";
        document.body.style.userSelect = "text"
        // Create fallback page structure
        const fallbackContainer = document.createElement("div");
        fallbackContainer.id = "fallback-container";
        fallbackContainer.innerHTML = `
            <style>

                #fallback-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 0px;
                    text-align: center;
                    width: 100%;
                    box-sizing: border-box;
                    background-image: url('/backgrounds/scrollBG.jpg');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                }
                
                .fallback-content {
                    max-width: 100%;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                }
                
                .fallback-content h1 {
                    font-size: 24px;
                    margin: 0 0 16px 0;
                    font-weight: 600;
                    line-height: 1.4;
                      color: #ffffff;
                }
                
                .fallback-content p {
                    font-size: 16px;
                    margin: 0 0 30px 0;
                    line-height: 1.6;
                    color: #ffffff;
                }
                
                .fallback-image {
                    max-width: 90%;
                    height: auto;
                    object-fit: contain;
                    margin-bottom: 16px;
                }
                
                .fallback-contact {
                    font-size: 14px;
                    line-height: 1.2;
                    color: #ffffff;
                  
                    margin-top: 0px;
                }
                .fallback-contact-item-big {
                  font-size: 17px;
                     margin-top: 5px;
                }
                .fallback-contact-item {
                   margin-top: 5px;
                }
                
                /* Tablet and up */
                @media (min-width: 768px) {
                    .fallback-content h1 {
                        font-size: 32px;
                    }
                    
                    .fallback-content p {
                        font-size: 18px;
                        margin: 0 0 40px 0;
                    }
                    
                    .fallback-image {
                        max-width: 250px;
                        margin-bottom: 24px;
                      
                    }
                    
                    .fallback-contact {
                        margin-top: 24px;
                        line-height: 1.4;
                    }
                    
                    .fallback-contact-item {
                        margin-bottom: 12px;
                    }
                }
                
                /* Desktop and up */
                @media (min-width: 1024px) {
                    .fallback-content h1 {
                        font-size: 40px;
                    }
                    
                    .fallback-content p {
                        font-size: 20px;
                    }
                    
                    .fallback-content {
                        max-width: 600px;
                    }
                }
            </style>
            
            <div class="fallback-content">
                <h1>Sorry!</h1>
                <p>${message}</p>
                <img src="/fallBack.png" alt="meat" class="fallback-image" />
                <div class="fallback-contact">
                    <div class="fallback-contact-item-big">kris@neuroproductions.be<br>
+32 485 94 11 55</div>
                    
                    <div class="fallback-contact-item">Lange Scholierstraat 55<br>
2060 Antwerp
Belgium</div>
                    <div class="fallback-contact-item">Neuro Productions Comm. V.<br>
VAT: BE089505166</div>
                </div>
            </div>
        `;

        this.appElement.appendChild(fallbackContainer);
    }
}
