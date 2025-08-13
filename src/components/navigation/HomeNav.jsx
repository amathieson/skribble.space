import React from "react";
import {useTranslation} from "react-i18next";
export const HomeNav = () => {
    const { t } = useTranslation("common");

    return (
        <header>
            <div className="toolbar">
                <h1>{t('title')}</h1>
            </div>

            <div className="nav_test">
                {/*<h3>PAGE 1</h3>*/}
            </div>
        </header>
    )
}