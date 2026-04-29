<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PromotionNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $promotion;

    public function __construct($promotion)
    {
        $this->promotion = $promotion;
    }

    public function build()
    {
        $brandColor = '#eca840';
        $title = $this->promotion->title;
        $desc = $this->promotion->description;
        $value = $this->promotion->discount_value;
        $typeLabel = $this->promotion->type === 'percentage' ? "{$value}% OFF" : "₱{$value} OFF";
        $img = $this->promotion->image ?? null;
        $imgHtml = $img ? "<div style='margin-bottom: 40px; border-radius: 24px; overflow: hidden; border: 1px solid #f0f0f0;'><img src='{$img}' style='width: 100%; display: block;' /></div>" : "";

        // Component Source: resources/js/Emails/PromotionNotificationEmail.tsx
        $html = "
        <div style='background-color: #fdfcfb; padding: 20px; font-family: Inter, Helvetica, Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; border: 1px solid #f0f0f0; box-shadow: 0 20px 50px rgba(0,0,0,0.04);'>
                <div style='background: #1a1a1a; padding: 60px 48px; textAlign: center; color: #ffffff; text-align: center;'>
                    <div style='display: inline-block; padding: 8px 20px; background-color: {$brandColor}; color: #1a1a1a; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24px;'>Artisanal Bounty</div>
                    <div style='font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 16px; line-height: 1.1;'>{$title}</div>
                    <p style='font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 4px; font-weight: 700;'>Exclusive Collection Access</p>
                </div>
                <div style='padding: 48px;'>
                    {$imgHtml}
                    <div style='text-align: center;'>
                        <p style='font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px;'>Special Privilege</p>
                        <div style='font-size: 64px; font-weight: 900; color: {$brandColor}; margin: 24px 0; letter-spacing: -2px;'>{$typeLabel}</div>
                        <p style='font-size: 16px; color: #444; line-height: 1.8; margin-bottom: 32px;'>{$desc}</p>
                        <a href='#' style='display: inline-block; padding: 20px 40px; background-color: #1a1a1a; color: #ffffff; border-radius: 16px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; text-decoration: none; margin-top: 32px;'>Claim This Bounty</a>
                    </div>
                    <div style='margin-top: 60px; padding-top: 40px; border-top: 1px solid #f0f0f0; text-align: center;'>
                        <p style='font-size: 10px; color: #bbb; text-transform: uppercase; letter-spacing: 3px; font-weight: 800;'>
                            &copy; 2026 <span style='color: {$brandColor};'>KOKOMMERCE</span> ARTISANAL BAKERY.<br />
                            SENT TO THE GALLERY MEMBERS.
                        </p>
                    </div>
                </div>
            </div>
        </div>";

        return $this->subject('Artisanal Bounty: ' . $title)
                    ->html($html);
    }
}
