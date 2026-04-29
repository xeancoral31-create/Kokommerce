import React from 'react';

interface PromotionNotificationEmailProps {
    promotion: {
        title: string;
        description: string;
        discount_value: number;
        type: string;
        image?: string;
    };
}

const PromotionNotificationEmail: React.FC<PromotionNotificationEmailProps> = ({ promotion }) => {
    const brandColor = '#eca840';
    const bgColor = '#fdfcfb';
    const textColor = '#2d2a26';

    const containerStyle: React.CSSProperties = {
        maxWidth: '600px',
        margin: '40px auto',
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
        fontFamily: "'Inter', Helvetica, Arial, sans-serif",
    };

    const heroStyle: React.CSSProperties = {
        background: '#1a1a1a',
        padding: '60px 48px',
        textAlign: 'center',
        color: '#ffffff',
    };

    const contentStyle: React.CSSProperties = {
        padding: '48px',
    };

    const badgeStyle: React.CSSProperties = {
        display: 'inline-block',
        padding: '8px 20px',
        backgroundColor: brandColor,
        color: '#1a1a1a',
        borderRadius: '100px',
        fontSize: '10px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '3px',
        marginBottom: '24px',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: 900,
        letterSpacing: '-1px',
        marginBottom: '16px',
        lineHeight: 1.1,
    };

    const discountStyle: React.CSSProperties = {
        fontSize: '64px',
        fontWeight: 900,
        color: brandColor,
        margin: '24px 0',
        letterSpacing: '-2px',
    };

    const buttonStyle: React.CSSProperties = {
        display: 'inline-block',
        padding: '20px 40px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '4px',
        textDecoration: 'none',
        marginTop: '32px',
    };

    return (
        <div style={{ backgroundColor: bgColor, padding: '20px' }}>
            <div style={containerStyle}>
                <div style={heroStyle}>
                    <div style={badgeStyle}>Artisanal Bounty</div>
                    <div style={titleStyle}>{promotion.title}</div>
                    <p style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 700 }}>Exclusive Collection Access</p>
                </div>

                <div style={contentStyle}>
                    {promotion.image && (
                        <div style={{ marginBottom: '40px', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                            <img src={promotion.image} alt={promotion.title} style={{ width: '100%', display: 'block' }} />
                        </div>
                    )}

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, marginBottom: '8px' }}>Special Privilege</p>
                        <div style={discountStyle}>
                            {promotion.type === 'percentage' ? `${promotion.discount_value}% OFF` : `₱${promotion.discount_value} OFF`}
                        </div>
                        
                        <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>
                            {promotion.description}
                        </p>

                        <a href="#" style={buttonStyle}>Claim This Bounty</a>
                    </div>

                    <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800 }}>
                            &copy; 2026 <span style={{ color: brandColor }}>KOKOMMERCE</span> ARTISANAL BAKERY.<br />
                            SENT TO THE GALLERY MEMBERS.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionNotificationEmail;
